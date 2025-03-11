import { Controller, Get, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ProfileUser } from 'src/enums/profileUser/profileUser.enum';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER)
  @Get('getAllPackages')
  getAllPackages() {
    return this.packagesService.getAllPackagesService();
  }
}
