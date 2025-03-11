import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreatedUserDto } from './Dtos/createdUser.dto';
import { StatusUser } from 'src/enums/statusUser/statusUser.enum';
import { ProfileUser } from 'src/enums/profileUser/profileUser.enum';
import Web3 from 'web3';
import Wallet from 'ethereumjs-wallet';
import { MailerService } from '../mailer/mailer.service';
import { PasswordResetToken } from '../entities/passwordReset.entity';
import { v4 as uuidv4 } from 'uuid';
import { UpdateInformationUserDto } from './Dtos/updateInformationUser.dto';
import { Credential } from 'src/entities/credential.entity';

@Injectable()
export class UsersRepository {
  private readonly web3: Web3;
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly tokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
  ) {
    this.web3 = new Web3();
  }

  //metodo para buscar usuario por correo electrónico
  async getUserByEmailRepository(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  //metodo para buscar un usuario por correo electrónico con las credentiales relacionadas
  async getUserByEmailAndCredentialRepository(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['credential'],
    });
  }

  //metodo para buscar usuario por nombre de usuario
  async getUserByUsernameRepository(username: string) {
    return await this.userRepository.findOne({
      where: { credential: { username } },
      relations: ['credential'],
    });
  }

  //metodo para crear nuevo usuario
  async createdUserRepository(createdUserDto: CreatedUserDto): Promise<string> {
    const { name, email, sponsor, username, password } = createdUserDto;

    const status =
      sponsor === 'ecastilla' ? StatusUser.INACTIVE : StatusUser.ACTIVE;
    const profile =
      sponsor === 'ecastilla' ? ProfileUser.AMBASSADOR : ProfileUser.USER;

    const uuidSponsor = await this.getUserByUsernameRepository(
      createdUserDto.sponsor,
    );

    const newWallet = Wallet.generate();

    const privateKey = `0x${newWallet.getPrivateKey().toString('hex')}`;
    const address = `0x${newWallet.getAddress().toString('hex')}`;

    const user = this.userRepository.create({
      name,
      email,
      sponsor: uuidSponsor.uuid,
      status,
      credential: {
        username,
        password,
        profile,
        walletPrivada: address,
        privateKey,
      },
    });
    await this.userRepository.save(user);
    console.log(
      '✅ Usuario creado en la base de datos -> ',
      user.credential.username,
    );
    await this.mailerService.sendEmailWelcome(
      email,
      name,
      username,
      sponsor,
      user.credential.profile,
    );

    return 'Usuario Registrado con Exito';
  }

  //metodo para resetear contraseña por correo electronico
  async resetPasswordRepository(emailExisting: User) {
    const user = emailExisting;
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    const resetToken = this.tokenRepository.create({ user, token, expiresAt });
    await this.tokenRepository.save(resetToken);
    await this.mailerService.sendResetEmail(user.email, token, user.name);
    return 'Correo de Recuperacion enviado';
  }

  //metodo para validar el token de recuperacion contraseña por correo
  async validateResetToken(token: string): Promise<User> {
    const resetToken = await this.tokenRepository.findOne({
      where: { token },
      relations: ['user', 'user.credential'],
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('El token es inválido o ha expirado');
    }

    return resetToken.user;
  }

  //metodo para actualizar contraseña de usuario solicitada por correo
  async updatePasswordEmailRepository(
    user: User,
    newPassword: string,
  ): Promise<string> {
    user.credential.password = newPassword;
    await this.userRepository.save(user);

    return 'Contraseña actualizada con éxito';
  }

  //metodo para buscar un usuario por uuid
  async getUserByUUIDRepository(id: string) {
    return await this.userRepository.findOne({
      where: { uuid: id },
      relations: ['credential'],
    });
  }
  //metodo para buscar los ultimos registros de un usuario
  async getLastRegister(id: string) {
    return await this.userRepository.find({
      where: { sponsor: id },
      order: { createdAt: 'DESC' },
      take: 3,
    });
  }

  //metodo para actualizar la información de un usuario
  async updateInformationUserRepository(
    id: string,
    updateInformationUserDto: UpdateInformationUserDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { uuid: id },
      relations: ['credential'],
    });
    user.birthdate = updateInformationUserDto.birthdate;
    user.country = updateInformationUserDto.country;
    user.celphone = updateInformationUserDto.celphone;
    user.credential.walletPublica = updateInformationUserDto.walletPublica;

    await this.credentialRepository.save(user.credential);
    await this.userRepository.save(user);
    return user;
  }

  async getUserInformationReferredService(id: string) {
    const firstLevelUsers = await this.userRepository.find({
      where: { sponsor: id },
    });
    const firstLevelUserIds = firstLevelUsers.map((user) => user.uuid);

    const secondLevelUsers = await this.userRepository.find({
      where: { sponsor: In(firstLevelUserIds) },
    });

    const secondLevelUsersIds = secondLevelUsers.map((user) => user.uuid);

    const thirdLevelUsers = await this.userRepository.find({
      where: { sponsor: In(secondLevelUsersIds) },
    });
    return {
      firstLevel: firstLevelUsers,
      secondLevel: secondLevelUsers,
      thirdLevel: thirdLevelUsers,
    };
  }
}
