import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {

  constructor(private userservice: UsersService) { }


  //http://localhost/users
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userservice.findAll();
  }

  @Post()//http://localhost/users
  create(@Body() user: CreateUserDto) {
    return this.userservice.create(user)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
    return this.userservice.update(id, user)
  }

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
