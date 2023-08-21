import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
export class SerachpDTO{
    @ApiProperty()
    @IsString()
    input :string

  }