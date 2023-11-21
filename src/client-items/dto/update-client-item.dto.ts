import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateClientItemDto {
  @IsBoolean()
  ticked: boolean;

  @IsString()
  @IsOptional()
  tickedBy?: string;
}
