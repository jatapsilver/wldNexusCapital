import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './entities/package.entity';
import data from '../src/utils/paquetes/data.json';
import { User } from 'src/entities/user.entity';
import { Credential } from 'src/entities/credential.entity';
import * as fs from 'fs';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Bienvenido al back de Neurobot IA';
  }
}

@Injectable()
export class DataLoaderPackages implements OnModuleInit {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async onModuleInit() {
    const packagesCount = await this.packageRepository.count();

    if (packagesCount === 0) {
      console.log('⏳ Cargando paquetes iniciales...');

      const queryRunner =
        this.packageRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await Promise.all(
          data.map(async (pkg) => {
            await queryRunner.query(
              `INSERT INTO packages (name, price) 
               VALUES ($1, $2) 
               ON CONFLICT (name) DO NOTHING;`,
              [pkg.name, pkg.price],
            );
          }),
        );

        await queryRunner.commitTransaction();
        console.log('✅ Paquetes precargados correctamente.');
      } catch (error) {
        console.error('❌ Error al precargar paquetes:', error);
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    } else {
      console.log('✔ Los paquetes ya existen en la base de datos.');
    }
  }
}

@Injectable()
export class DataLoaderUsers implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
  ) {}

  async onModuleInit() {
    const usersCount = await this.userRepository.count();

    if (usersCount === 0) {
      console.log('⏳ Cargando usuarios iniciales...');
      const queryRunner =
        this.userRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const rawData = fs.readFileSync('./src/utils/users/data.json', 'utf-8');
        const users = JSON.parse(rawData);

        await Promise.all(
          users.map(async (user) => {
            const newUser = this.userRepository.create({
              name: user.name,
              email: user.email,
              birthdate: user.birthdate,
              country: user.country,
              celphone: user.celphone,
              status: user.status,
              sponsor: user.sponsor,
            });

            const savedUser = await queryRunner.manager.save(newUser);

            const newCredential = this.credentialRepository.create({
              user: savedUser,
              username: user.username,
              password: user.password,
              profile: user.profile,
              walletPrivada: user.walletPrivada,
              walletPublica: user.walletPublica,
              privateKey: user.privateKey,
            });

            await queryRunner.manager.save(newCredential);
          }),
        );

        await queryRunner.commitTransaction();
        console.log('✅ Usuarios precargados correctamente.');
      } catch (error) {
        console.error('❌ Error al precargar usuarios:', error);
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    } else {
      console.log('✔ Los usuarios ya existen en la base de datos.');
    }
  }
}
