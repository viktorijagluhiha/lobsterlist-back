import { Controller, Post, Body, Patch, Param, HttpException, HttpStatus } from "@nestjs/common";
import { ClientItemsService } from "./client-items.service";
import { UpdateClientItemDto } from "./dto/update-client-item.dto";
import { FindClientItemDto } from "./dto/find-client-item.dto";

@Controller('client-items')
export class ClientItemsController {
  constructor(private readonly clientItemsService: ClientItemsService) {}

  @Post()
  async findAll(@Body() findClientItemDto: FindClientItemDto) {
    try {
      return await this.clientItemsService.findAll(findClientItemDto);
    } catch(error) {
      throw new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); 
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClientItemDto: UpdateClientItemDto) {
    try {
      return await this.clientItemsService.update(+id, updateClientItemDto);
    } catch(error) {
      throw new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); 
    }
  }
}
