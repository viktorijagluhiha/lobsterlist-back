## Description

Project created on [Nest](https://github.com/nestjs/nest) framework.

<p align="center">
  <a href="https://nestjs.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nestjs/nestjs-plain.svg" alt="nestjs" width="40" height="40"/> </a>  <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a>  <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a>
</p>

This backend serves as the foundation for a website dedicated to sharing wish list.

The ```admin``` section is designed for the administrator, displaying their wishes on the website. The ```client-items``` segment is meant to handle requests from the user's frontend.

```Item``` model is utilized to represent each wish.

Here's an example of how could such table look like for user:
| **Chosen** | **Precious gift**              | **Approximate price** | **Description**                                                           | **Links** | **Priority** |
|:----------:|--------------------------------|:---------------------:|---------------------------------------------------------------------------|-----------|--------------|
| ☐          | 16GB USB Stick                 | 5€ - 30€              | 16GB or more, USB 3.0, with a preference for a sleek, dark-colored design | [Link to one of the possibilities](https://www.samsung.com/lv/memory-storage/usb-flash-drive/usb-flash-drive-fit-plus-128gb-muf-128ab-apc/)||
| ☑          | Soup Plate	                    | 10€ - 100€            | smooth, with an enchanting coloring or a unique pattern                   | [Example](https://www.iittala.com/en-lv/tableware/plates-and-bowls/bowls/taika-bowl-28l26cm-blue-1006017), [Another example](https://www.iittala.com/en-lv/tableware/all-tableware/all-tableware-items/teema-plate-deep-21cm-vintage-blue-1061238)||
| ☐          | Leather Gloves                 | 20€ - 50€             | opt for a masculine model with a refined, simple style                    |           ||


## Installation

Use **Node.js 24.15 or newer on the 24.x LTS line** and npm. The `.nvmrc`
selects Node 24; the Docker image uses the same LTS line.

Alternatively, use the Nix flake from this directory instead of nvm:

```bash
nix develop
npm ci
npm run start:dev
```

If env-s do not exist yet, copy `.env.txt` to `.env` and `db.env.txt` to `db.env`.
Set matching PostgreSQL credentials in both files. For a backend running on the
host, `.env` should contain:

```dotenv
DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@localhost:5020/DB_NAME?schema=public"
```

Prisma 7 loads the migration URL through `prisma.config.ts`. The backend loads
`.env` explicitly and connects using `@prisma/adapter-pg`.

## Running the app

### For development

```bash
# PostgreSQL is exposed to the host on port 5020
npm run prisma:generate # optional: npm ci already generates the client
docker compose up -d lobsterlist-postgres
npm run prisma:migrate

# backend on http://localhost:3000
npm start

# alternatively, watch mode
npm run start:dev
```

To run the compiled application locally:

```bash
npm run build
npm run start:prod
```

### For production with Docker Compose

Start PostgreSQL and apply migrations from the host using the `localhost:5020`
URL before starting the backend:

```bash
docker compose up -d lobsterlist-postgres
npm run prisma:migrate
```

For the backend container, set `DATABASE_URL` in `.env` to use
`lobsterlist-postgres:5432` instead of `localhost:5020`. Containers use the
internal PostgreSQL port, while local npm commands use the external port 5020.


```bash
docker compose up -d --build lobsterlist-back
```

The backend container is exposed on port **3021**. The image installs from the
npm lockfile, generates Prisma before compiling, and includes only production
dependencies at runtime. Environment files are excluded from the image.

## Test

```bash
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run test:cov
npm run lint
```

Unit tests do not require PostgreSQL. E2E tests use `DATABASE_URL` from the
environment or `.env`, create and migrate a unique temporary PostgreSQL schema,
and remove it afterward. The database user must be able to create schemas.
Existing item data is not modified. The tests cover creation with links, bulk
creation, priority and price sorting, reservation/release, cascade deletion,
validation, and CORS using the same application setup as production.

## Endpoints

| HTTP method | URL | Path variables | Body | Description |
|:---:| --- | --- | --- | --- |
| POST | /admin/items | - | JSON<br> <pre>{<br>  title: string;<br>  description?: string;<br>  priceFrom: string;<br>  priceTo?: string;<br>  links?: [{<br>    href: string;<br>    description?: string;<br>  }];<br>}</pre> | Create new Item. |
| POST | /admin/items/multiple | - | JSON<br> <pre>{<br>  data: [{<br>    title: string;<br>    description?: string;<br>    priceFrom: string;<br>    priceTo?: string;<br>    links?: [{<br>      href: string;<br>      description?: string;<br>    }];<br>  }]<br>}</pre> | Create multiple new Items from data array. |
| GET | /admin/items | - | - | Get all Items. Ordered by ```priority``` field. |
| PATCH | /admin/items/:id | id: number | JSON<br> <pre>{<br>  priority: number;<br>}</pre> | Update Item's ```priority``` value. |
| DELETE | /admin/items/:id | id: number | - | Delete Item by ```id```.<br> Unlike others URL, response is in format:<br> <pre>{<br>  id: number;<br>}</pre> |
| POST | /client-items | - | JSON<br> <pre>{<br>  title?: "asc" &#124; "desc";<br>  priceFrom?: "asc" &#124; "desc";<br>  priority?: "asc" &#124; "desc";<br>  ticked?: "asc" &#124; "desc";<br>}</pre> | Get all Items ordered by user specified sorting fields. |
| PATCH | /client-items/:id | id: number | JSON<br> <pre>{<br>  ticked: boolean;<br>  tickedBy?: string;<br>}</pre> | Update Item's ```ticked``` field's value and modify related fields (```tickedAt``` and ```tickedBy```). |

## Support

If you wanna support my coding crimes, I would always appreciate your [investment in my tea](https://www.paypal.com/donate/?hosted_button_id=YBLWNJ376T8Y8).

## License

MIT licensed
