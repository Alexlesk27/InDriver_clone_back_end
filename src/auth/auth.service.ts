import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { register } from 'module';
import { User } from 'src/users/user.entity';
import { Repository, In } from 'typeorm';
import { RegsiterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRespository: Repository<User>,
        @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
        private jwtService: JwtService
    ) {

    }

 
    async register(user: RegsiterAuthDto) {
        const { email, phone} = user;

        const emailExist = await this.userRespository.findOneBy({ email });
        const phoneExist = await this.userRespository.findOneBy({ phone });

        const newUser = this.userRespository.create(user);
        const rolesIds = user.rolesIds
        if (emailExist) {
            throw new HttpException("Email já existe", HttpStatus.CONFLICT);
        }

        if (phoneExist) {
            throw new HttpException("Telefone já existe", HttpStatus.CONFLICT);
        }

        const roles = await this.rolesRepository.findBy({id: In(rolesIds)})

        newUser.roles = roles;
        // Adicione logs para depurar os valores
        console.log('user:', user);
        console.log('rolesIds:', rolesIds);

       
        const userSaved = await this.userRespository.save(newUser);

        const payload = {
            id: userSaved.id,
            name: userSaved.name,
        };

        const token = this.jwtService.sign(payload);
        const data = {
            user: userSaved,
            token: 'Bearer ' + token,
        };

        // Remova a senha do usuário salvo antes de retornar
        delete data.user.password;
        return data;
    }

    async login(loginData: LoginAuthDto) {

        const { email, password } = loginData
        const userFound = await this.userRespository.findOne({where:{
            email: email},
            relations: ['roles']
        }
    )

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
