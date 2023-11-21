import { IsInt } from "class-validator";

export class UpdateItemDto {
  @IsInt()
  priority: number;
}
