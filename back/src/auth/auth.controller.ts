import { Body, Controller, HttpCode, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreatedUserDto } from 'src/users/Dtos/createdUser.dto';
import { ResetPasswordDto } from 'src/users/Dtos/resetPassword.dto';
import { UpdatePasswordEmailDto } from 'src/users/Dtos/updatePasswordEmail.dto';
import { LoginDto } from 'src/users/Dtos/login.dto';

@ApiTags('AuthService')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('signup')
  async signup(@Body() createdUserDto: CreatedUserDto) {
    return this.authService.signupServices(createdUserDto);
  }

  @HttpCode(200)
  @Post('signin')
  async signin(@Body() loginDto: LoginDto) {
    return this.authService.signinServices(loginDto);
  }

  @Put('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPasswordService(resetPasswordDto);
  }

  @Put('updatePasswordEmail')
  async updatePasswordEmail(
    @Body() updatePasswordEmail: UpdatePasswordEmailDto,
  ) {
    return this.authService.resetPasswordEmailService(updatePasswordEmail);
  }
}
