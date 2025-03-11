import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ProfileUser } from 'src/enums/profileUser/profileUser.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateInformationUserDto } from './Dtos/updateInformationUser.dto';

@ApiTags('UserService')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    ProfileUser.USER,
    ProfileUser.AMBASSADOR,
    ProfileUser.SUPERADMIN,
    ProfileUser.ADMIN,
  )
  @Get('userBasicInformacion/:id')
  GetBasicInformation(@Param('id') id: string) {
    return this.usersService.GetBasicInformationService(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.USER, ProfileUser.AMBASSADOR)
  @Get('getInformationUser/:id')
  getInformationUser(@Param('id') id: string) {
    return this.usersService.getInformationUserService(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.USER, ProfileUser.AMBASSADOR)
  @Get('userInformationStart/:id')
  GetInformationStart(@Param('id') id: string) {
    return this.usersService.GetInformationStartService(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.USER, ProfileUser.AMBASSADOR)
  @Put('updateInformationUser/:id')
  GetTransactions(
    @Param('id') id: string,
    @Body() updateInformationUserDto: UpdateInformationUserDto,
  ) {
    return this.usersService.updateInformationUserService(
      id,
      updateInformationUserDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ProfileUser.USER, ProfileUser.AMBASSADOR)
  @Get('userInformationReferred/:id')
  getUserInformationReferred(@Param('id') id: string) {
    return this.usersService.getUserInformationReferredService(id);
  }
}
