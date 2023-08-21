import { ApiProperty } from "@nestjs/swagger"
import { IsOptional } from "class-validator"

export class UpdateUserDTO{ 
  @ApiProperty()   
  @IsOptional()
  username?  :String
  @ApiProperty()
  avatar?    :String
  @ApiProperty()
  XP?        :number
  @ApiProperty()
  win?       :number
  @ApiProperty()
  loss?      :number
  @ApiProperty()
  draw?      :number
}