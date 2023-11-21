import { IsArray, IsDecimal, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class CreateItemLinkDto {
  @IsString()
  @IsNotEmpty()
  href: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  priceFrom: number;

  @IsDecimal()
  @IsOptional()
  priceTo?: number;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => CreateItemLinkDto)
  @IsOptional()
  links?: CreateItemLinkDto[];
}

export class CreateItemDtos {
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => CreateItemDto)
  data: CreateItemDto[];
}
