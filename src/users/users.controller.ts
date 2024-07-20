import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/auth.guard';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.gaurd';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-roles';

@Controller('users')
export class UsersController {

  constructor(private userservice: UsersService) { }


  //http://localhost/users
  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll() {
    return this.userservice.findAll();
  }

  @Post()//http://localhost/users
  create(@Body() user: CreateUserDto) {
    return this.userservice.create(user)
  }

  @HasRoles(JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
    return this.userservice.update(id, user)
  }

  @HasRoles(JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadWithImage(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
        new FileTypeValidator({ fileType: '.(jpeg|png)' }),
      ],
    }),

  ) file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number, 
    @Body() user: UpdateUserDto) 
    {
    
   return this.userservice.updateWithImage(file, id, user)
  }


}
