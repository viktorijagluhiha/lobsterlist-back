import { Injectable } from "@nestjs/common";
import { UpdateClientItemDto } from "./dto/update-client-item.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { FindClientItemDto } from "./dto/find-client-item.dto";

@Injectable()
export class ClientItemsService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async findAll(findClientItemDto: FindClientItemDto) {
    return await this.prisma.item.findMany({
      include: {
        links: true,
      },
      orderBy: Object.keys(findClientItemDto).length ? findClientItemDto : {priority: "asc"},
    });
  }

  async update(id: number, updateClientItemDto: UpdateClientItemDto) {
    if (updateClientItemDto.ticked) {
      const tickedBy = updateClientItemDto.tickedBy ? updateClientItemDto.tickedBy : this.generateTickedBy();

      return await this.prisma.item.update({
        where: {
          id: id,
          ticked: false,
        },
        data: {
          ticked: updateClientItemDto.ticked,
          tickedAt: new Date(),
          tickedBy: tickedBy,
        },
        include: {
          links: true,
        },
      });

    } else {
      return await this.prisma.item.update({
        where: {
          id: id,
          AND: [
            {ticked: true},
            {OR: [
              {tickedBy: updateClientItemDto.tickedBy},
              {tickedBy: null},
            ]},
          ],
        },
        data: {
          ticked: updateClientItemDto.ticked,
          tickedAt: null,
          tickedBy: null,
        },
        include: {
          links: true,
        },
      });
    }
  }

  generateTickedBy(): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }
}
