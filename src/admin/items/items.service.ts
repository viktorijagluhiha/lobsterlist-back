import { Injectable } from "@nestjs/common";
import { CreateItemDto, CreateItemDtos } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ItemsService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async create(createItemDto: CreateItemDto) {
    const {links, ...itemData} = {links: [], ...createItemDto};

    return await this.prisma.item.create({
      data: {
        ...itemData,
        links: {
          createMany: {
            data: links,
          },
        },
      },
      include: {
        links: true,
      },
    });
  }

  async createMany(createItemDtos: CreateItemDtos) {
    return await Promise.all(createItemDtos.data.map(async (createItemDto) => (await this.create(createItemDto))));
  }

  async findAll() {
    return await this.prisma.item.findMany({
      include: {
        links: true,
      },
      orderBy: {
        priority: "asc",
      },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    return await this.prisma.item.update({
      where: {
        id: id,
      },
      data: updateItemDto,
      include: {
        links: true,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.item.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });
  }
}
