import { Prisma } from "@prisma/client";
import { IsIn, IsOptional, IsString } from "class-validator";

const sortOrderValues = ["asc", "desc"] as const;

export class FindClientItemDto {
  @IsString()
  @IsIn(sortOrderValues)
  @IsOptional()
  title?: Prisma.SortOrder;

  @IsString()
  @IsIn(sortOrderValues)
  @IsOptional()
  priceFrom?: Prisma.SortOrder;

  @IsString()
  @IsIn(sortOrderValues)
  @IsOptional()
  priority?: Prisma.SortOrder;

  @IsString()
  @IsIn(sortOrderValues)
  @IsOptional()
  ticked?: Prisma.SortOrder;
}
