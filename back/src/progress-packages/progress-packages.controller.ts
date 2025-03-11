import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProgressPackagesService } from './progress-packages.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProfileUser } from 'src/enums/profileUser/profileUser.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('progress-packages')
export class ProgressPackagesController {
  constructor(
    private readonly progressPackagesService: ProgressPackagesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.AMBASSADOR, ProfileUser.USER)
  @Get('getUserPackageProgress/:id')
  getUserPackageProgress(@Param('id') id: string) {
    return this.progressPackagesService.getUserPackageProgressService(id);
  }
}
