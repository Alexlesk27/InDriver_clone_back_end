import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userservice: UsersService){}

    @Post()//http://localhost/users
    create(@Body() user: CreateUserDto){
      return this.userservice.create(user)
    }
}
