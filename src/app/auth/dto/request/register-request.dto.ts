import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'email',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'username',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'password',
  })
  @IsNotEmpty()
  confirmPassword: string;
}
