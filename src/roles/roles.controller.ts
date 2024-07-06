import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { create } from 'domain';
import { CreateRolDto } from './dto/create-rol.dto';

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService){}

    @Post()
    create(@Body() rol: CreateRolDto){
        return this.roleService.create(rol);
    }
}
