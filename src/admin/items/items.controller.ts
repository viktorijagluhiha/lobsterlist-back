import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { CreateItemDto, CreateItemDtos } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";

@Controller("admin/items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    try {
      return await this.itemsService.create(createItemDto);
    } catch(error) {
      throw new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); 
    }
  }

  @Post("multiple")
  async createMany(@Body() createItemDtos: CreateItemDtos) {
    try {
      return await this.itemsService.createMany(createItemDtos);
    } catch(error) {
      throw new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); 
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.itemsService.findAll();
    } catch(error) {
      throw new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); 
    }
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateItemDto: UpdateItemDto) {
    try {
      return await this.itemsService.update(+id, updateItemDto);
    } catch(error) {
      throw new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); 
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      return await this.itemsService.remove(+id);
    } catch(error) {
      throw new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); 
    }
  }
}
