import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

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
  @IsNotEmpty() 
  roomId: number
  @ApiProperty()  
  @IsString()   
  @IsNotEmpty()        
  userId  : String
}

export class CreateChannel{ 
  @ApiProperty()  
  @IsNotEmpty()  
  @IsString()          
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
  roomId?  :String
  @ApiProperty()             
  name?  :String
  @ApiProperty()
  image?  :String
  @ApiProperty()
  type?  : String
  @ApiProperty()
  @IsOptional()
  password?  : String
}

export class PasswordDTO{
  @IsNotEmpty()
  @MaxLength(60)
  password  : String
}