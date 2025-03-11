import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatedUserDto } from 'src/users/Dtos/createdUser.dto';
import { LoginDto } from 'src/users/Dtos/login.dto';
import { ResetPasswordDto } from 'src/users/Dtos/resetPassword.dto';
import { UpdatePasswordEmailDto } from 'src/users/Dtos/updatePasswordEmail.dto';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  //Incia la logica para el servicio de registar un usuario
  async signupServices(createdUserDto: CreatedUserDto): Promise<string> {
    if (!createdUserDto.email || !createdUserDto.password) {
      throw new BadRequestException('El email y el password son necesarios');
    }
    const emailExisting = await this.userRepository.getUserByEmailRepository(
      createdUserDto.email,
    );
    if (emailExisting) {
      throw new BadRequestException('Este email ya está en uso');
    }
    const usernameExisting =
      await this.userRepository.getUserByUsernameRepository(
        createdUserDto.username,
      );
    if (usernameExisting) {
      throw new BadRequestException('Este nombre de usuario ya está en uso');
    }
    const sponsorExisting =
      await this.userRepository.getUserByUsernameRepository(
        createdUserDto.sponsor,
      );
    if (!sponsorExisting) {
      throw new BadRequestException('Este patrocinador no existe');
    }
    if (sponsorExisting.status === 'inactive') {
      throw new ConflictException('Este patrocinador se encuentra inactivo');
    }

    if (sponsorExisting.status === 'suspended') {
      throw new ConflictException('Este patrocinador se encuentra suspendido');
    }

    return await this.userRepository.createdUserRepository(createdUserDto);
  }

  // inicia la logica para el servicio de recuperar contraseña
  async resetPasswordService(resetPasswordDto: ResetPasswordDto) {
    const emailExisting = await this.userRepository.getUserByEmailRepository(
      resetPasswordDto.email,
    );
    if (!emailExisting) {
      throw new NotFoundException('Este email no esta registrado');
    }

    return this.userRepository.resetPasswordRepository(emailExisting);
  }

  // incia la logica para actualizar la contraseña por correo
  async resetPasswordEmailService(updatePasswordEmail: UpdatePasswordEmailDto) {
    const user = await this.userRepository.validateResetToken(
      updatePasswordEmail.token,
    );
    if (!user) {
      throw new BadRequestException('El Token ha expirado o es invalido');
    }
    return this.userRepository.updatePasswordEmailRepository(
      user,
      updatePasswordEmail.newPassword,
    );
  }

  // incia la logica para el servicio de iniciar sesión
  async signinServices(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user =
      await this.userRepository.getUserByEmailAndCredentialRepository(
        loginDto.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Correo electronico o contraseña son inválidas',
      );
    }

    if (loginDto.password !== user.credential.password) {
      throw new UnauthorizedException(
        'Correo electronico o contraseña son inválidas',
      );
    }

    if (user.status === 'inactive') {
      throw new UnauthorizedException('Este usuario se encuentra inactivo');
    }

    const payload = {
      username: user.credential.username,
      sub: user.uuid,
      profile: Array.isArray(user.credential.profile)
        ? user.credential.profile
        : [user.credential.profile],
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
