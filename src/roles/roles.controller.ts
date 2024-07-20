import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { JwtAuthGuard } from 'src/auth/jwt/auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.gaurd';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-roles';

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService){}

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    create(@Body() rol: CreateRolDto){
        return this.roleService.create(rol);
    }
}
