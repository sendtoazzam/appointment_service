import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'username',
  })
  @ValidateIf((dto) => !dto.email)
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: 'email',
  })
  @ValidateIf((dto) => !dto.username)
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'password',
  })
  @IsNotEmpty()
  readonly password: string;
}
