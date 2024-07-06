import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import storage = require('../utils/cloud_storage');
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User) private userRepostory: Repository<User>,
  @InjectRepository(Rol) private roleRepostory: Repository<Rol>
  ) { }

  create(user: CreateUserDto) {
    const newUser = this.userRepostory.create(user);
    return this.userRepostory.save(newUser);
  }

  
  findAll() {
    return this.userRepostory.find({relations: ['roles']});
  }


  async update(id: number, user: UpdateUserDto) {
    const userFound = await this.userRepostory.findOneBy({ id: id })

    if (!userFound) {
      return new HttpException('Usuário não existe', HttpStatus.NOT_FOUND)
    }

    const updatedUser = Object.assign(userFound, user)
    return this.userRepostory.save(updatedUser)
  }

  async updateWithImage(image: Express.Multer.File, id: number, user: UpdateUserDto) {

    const url = await storage(image, image.originalname);
    console.log('Url' + url)

    if(url === undefined && url === null){
      return new HttpException('Não foi possivel salvar a imagem', HttpStatus.INTERNAL_SERVER_ERROR)
    }


    const userFound = await this.userRepostory.findOneBy({ id: id })

    if (!userFound) {
      return new HttpException('Usuário não existe', HttpStatus.NOT_FOUND)
    }

    user.image = url;
    const updatedUser = Object.assign(userFound, user)
    return this.userRepostory.save(updatedUser)

  }
}
