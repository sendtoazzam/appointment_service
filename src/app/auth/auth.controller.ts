import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/request/auth-request.dto';
import { LoginResponseDto } from './dto/response/auth-response.dto';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
    description: 'You have successfully login',
  })
  @ApiResponse({ status: 401, description: 'Username or password invalid' })
  async authenticate(
    @Body() dto: LoginRequestDto,
    @Headers() headers,
  ): Promise<LoginResponseDto> {
    const authenticateUser = await this.authService.authenticate(dto, headers);
    return authenticateUser;
  }

  @Public()
  @Post('register')
  @ApiResponse({
    status: 200,
    type: String,
    description: 'Register Successful',
  })
  @ApiResponse({ status: 401, description: 'Unable to register user' })
  async register(
    @Body() dto: RegisterRequestDto,
    @Headers() headers,
  ): Promise<string> {
    const registerUser = await this.authService.register(dto, headers);
    return registerUser;
  }
}
