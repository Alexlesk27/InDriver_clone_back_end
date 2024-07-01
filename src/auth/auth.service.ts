import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { register } from 'module';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegsiterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRespository: Repository<User>) {

    }

    async register(user: RegsiterAuthDto) {

        const { email, phone } = user;

        const emailExist = await this.userRespository.findOneBy({ email: email })
        const phoneExist = await this.userRespository.findOneBy({ phone: phone })

        if (emailExist) {
            return new HttpException("Email já exite", HttpStatus.CONFLICT)
        }

        if (phoneExist) {
            return new HttpException("Telefone já existe", HttpStatus.CONFLICT)
        }


        const newUser = this.userRespository.create(user);
        return this.userRespository.save(newUser);

    }

    async login(loginData: LoginAuthDto) {

        const { email, password } = loginData
        const userFound = await this.userRespository.findOneBy({ email: email })

        if (!userFound) {
            return new HttpException("Email não cadastrado", HttpStatus.NOT_FOUND)
        }

        const isPasswordValid = await compare(password, userFound.password)

        if (!isPasswordValid) {
            return new HttpException("Senha incorreta", HttpStatus.FORBIDDEN)
        }

        return userFound;
    }

}
