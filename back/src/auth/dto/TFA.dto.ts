import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class TFA{
    @ApiProperty()
    @IsString()
    code :string
  }