import "dotenv/config";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaPg } from "@prisma/adapter-pg";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { configureApp } from "../src/app.setup";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaService } from "../src/prisma/prisma.service";

describe("Item API (PostgreSQL)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cleanupClient: PrismaClient;
  let schema: string;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeAll(async () => {
    if (!originalDatabaseUrl) {
      throw new Error(
        "Set DATABASE_URL in the environment or .env for e2e tests",
      );
    }

    // Migrate a unique schema so the tests never modify existing item data.
    schema = `e2e_${randomUUID().replaceAll("-", "")}`;
    const databaseUrl = new URL(originalDatabaseUrl);
    databaseUrl.searchParams.set("schema", schema);
    process.env.DATABASE_URL = databaseUrl.toString();
    cleanupClient = new PrismaClient({
      adapter: new PrismaPg({ connectionString: originalDatabaseUrl }),
    });
    execFileSync(
      process.execPath,
      [require.resolve("prisma/build/index.js"), "migrate", "deploy"],
      {
        env: process.env,
        timeout: 30000,
        stdio: "pipe",
      },
    );

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = moduleFixture.get(PrismaService);
  }, 40000);

  afterEach(async () => {
    await prisma?.item.deleteMany();
  });

  afterAll(async () => {
    try {
      await app?.close();
      if (cleanupClient) {
        await cleanupClient.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );
      }
    } finally {
      await cleanupClient?.$disconnect();
      if (originalDatabaseUrl === undefined) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = originalDatabaseUrl;
      }
    }
  });

  const itemData = {
    title: "Upgrade regression item",
    priceFrom: "12.34",
    priceTo: "56.78",
    links: [{ href: "https://example.com/gift", description: "Gift link" }],
  };

  async function createItem() {
    const response = await request(app.getHttpServer())
      .post("/admin/items")
      .send(itemData)
      .expect(201);
    return response.body;
  }

  it("creates items with nested links and preserves decimal response values", async () => {
    const item = await createItem();
    expect(item).toMatchObject({
      title: itemData.title,
      priceFrom: "12.34",
      priceTo: "56.78",
      ticked: false,
      tickedAt: null,
      tickedBy: null,
      links: [
        expect.objectContaining({ ...itemData.links[0], itemId: item.id }),
      ],
    });
    expect(await prisma.item.count()).toBe(1);
  });

  it("creates multiple items and lists them by priority", async () => {
    const response = await request(app.getHttpServer())
      .post("/admin/items/multiple")
      .send({ data: [itemData, { title: "Second item", priceFrom: "9.99" }] })
      .expect(201);
    const [first, second] = response.body;
    await request(app.getHttpServer())
      .patch(`/admin/items/${second.id}`)
      .send({ priority: first.priority - 1 })
      .expect(200);

    const list = await request(app.getHttpServer())
      .get("/admin/items")
      .expect(200);
    expect(list.body.map((item: { id: number }) => item.id)).toEqual([
      second.id,
      first.id,
    ]);
    expect(list.body[0].links).toEqual([]);
  });

  it("sorts client items by the requested field", async () => {
    const first = await createItem();
    const response = await request(app.getHttpServer())
      .post("/admin/items")
      .send({ title: "Cheaper item", priceFrom: "1.50" })
      .expect(201);
    const list = await request(app.getHttpServer())
      .post("/client-items")
      .send({ priceFrom: "asc" })
      .expect(201);
    expect(list.body.map((item: { id: number }) => item.id)).toEqual([
      response.body.id,
      first.id,
    ]);
  });

  it("lists client items with an empty body using default priority order", async () => {
    const first = await createItem();
    const second = await createItem();
    await request(app.getHttpServer())
      .patch(`/admin/items/${second.id}`)
      .send({ priority: first.priority - 1 })
      .expect(200);
    const list = await request(app.getHttpServer())
      .post("/client-items")
      .send({})
      .expect(201);
    expect(list.body.map((item: { id: number }) => item.id)).toEqual([
      second.id,
      first.id,
    ]);
  });

  it("reserves an item and only lets the matching token release it", async () => {
    const item = await createItem();
    const reserved = await request(app.getHttpServer())
      .patch(`/client-items/${item.id}`)
      .send({ ticked: true })
      .expect(200);
    expect(reserved.body.ticked).toBe(true);
    expect(reserved.body.tickedBy).toMatch(/^[A-Za-z0-9]{10}$/);
    expect(Number.isNaN(Date.parse(reserved.body.tickedAt))).toBe(false);

    await request(app.getHttpServer())
      .patch(`/client-items/${item.id}`)
      .send({ ticked: true })
      .expect(500);
    await request(app.getHttpServer())
      .patch(`/client-items/${item.id}`)
      .send({ ticked: false, tickedBy: "wrongtoken" })
      .expect(500);

    const released = await request(app.getHttpServer())
      .patch(`/client-items/${item.id}`)
      .send({ ticked: false, tickedBy: reserved.body.tickedBy })
      .expect(200);
    expect(released.body).toMatchObject({
      ticked: false,
      tickedAt: null,
      tickedBy: null,
    });
  });

  it("deletes an item and cascades deletion to its links", async () => {
    const item = await createItem();
    await request(app.getHttpServer())
      .delete(`/admin/items/${item.id}`)
      .expect(200)
      .expect({ id: item.id });
    expect(await prisma.item.count()).toBe(0);
    expect(await prisma.itemLink.count()).toBe(0);
  });

  it("rejects invalid and unknown fields, including nested link fields", async () => {
    await request(app.getHttpServer())
      .post("/admin/items")
      .send({ ...itemData, unexpected: true })
      .expect(400);
    await request(app.getHttpServer())
      .post("/admin/items")
      .send({ ...itemData, links: [{ href: 123 }] })
      .expect(400);
    await request(app.getHttpServer())
      .post("/client-items")
      .send({ priceFrom: "invalid" })
      .expect(400);
    expect(await prisma.item.count()).toBe(0);
  });

  it("keeps CORS enabled for frontend clients", async () => {
    await request(app.getHttpServer())
      .options("/client-items")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "PATCH")
      .expect(204)
      .expect("Access-Control-Allow-Origin", "*");
  });
});
