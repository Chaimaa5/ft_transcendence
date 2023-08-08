import { ApiProperty } from "@nestjs/swagger"

export class CreateRoom{ 
  @ApiProperty()             
  name  :String
  @ApiProperty()
  image?  :String
  @ApiProperty()
  memberId    :String
}

export class AddMember{ 
  @ApiProperty()
  roomId: number
  @ApiProperty()             
  userId  : String
  // @ApiProperty()
  // role  : String

}

export class CreateChannel{ 
  @ApiProperty()             
  name  :String
  @ApiProperty()
  image?  :String
  @ApiProperty()
  type?  : String
  @ApiProperty()
  password?  : String
  // @ApiProperty()
  // members: AddMember[]

}


export class UpdateChannel{ 
  @ApiProperty()             
  roomId?  :number
  @ApiProperty()             
  name?  :String
  @ApiProperty()
  image?  :String
  @ApiProperty()
  type?  : String
  @ApiProperty()
  password?  : String
}