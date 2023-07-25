import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDTO{ 
  @ApiProperty()             
  username?  :String
  @ApiProperty()
  fullname?  :String
  @ApiProperty()
  avatar?    :String
  @ApiProperty()
  TFA?       :Boolean
  @ApiProperty()
  TFASecret? :String
  @ApiProperty()
  XP?        :number
  @ApiProperty()
  win?       :number
  @ApiProperty()
  loss?      :number
  @ApiProperty()
  draw?      :number
}