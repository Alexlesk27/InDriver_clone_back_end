import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { register } from 'module';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegsiterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRespository: Repository<User>,
        private jwtService: JwtService
    ) {

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
        const userSaved = await this.userRespository.save(newUser);

        const payload = {
            id: userSaved.id,
            name: userSaved.name,
        };

        const token = this.jwtService.sign(payload);
        const data = {
            user: userSaved,
            token: 'Bearer ' + token
        }

        delete data.user.password
        return data;
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

        const payload = {
            id: userFound.id,
            name: userFound.name,
        };

        const token = this.jwtService.sign(payload);
        const data = {
            user: userFound,
            token: 'Bearer ' + token
        }

        delete data.user.password
        return data;
    }

}
