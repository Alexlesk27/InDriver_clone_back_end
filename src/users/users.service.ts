import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepostory: Repository<User>
){}

  create(user: CreateUserDto){
     const newUser = this.userRepostory.create(user);
     return this.userRepostory.save(newUser);
  }
}
