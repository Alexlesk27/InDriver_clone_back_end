import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginAuthDto{

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: String;

    @IsString()
    @IsNotEmpty()
    password: String
}