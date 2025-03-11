import { forwardRef, Module } from '@nestjs/common';
import { ProgressPackagesController } from './progress-packages.controller';
import { ProgressPackagesService } from './progress-packages.service';
import { ProgressPackagesRepository } from './progress-packages.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageProgress } from 'src/entities/packageProgress.entity';
import { User } from 'src/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PackageProgress, User]),
    forwardRef(() => UsersModule),
    MailerModule,
  ],
  controllers: [ProgressPackagesController],
  providers: [
    ProgressPackagesService,
    ProgressPackagesRepository,
    UsersRepository,
  ],
  exports: [ProgressPackagesRepository],
})
export class ProgressPackagesModule {}
