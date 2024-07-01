import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegsiterAuthDto{

    @IsNotEmpty()
    @IsString({message: 'teste'})
    name: String;

    @IsNotEmpty()
    @IsString()
    lastName: String;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: String;

    @IsNotEmpty()
    @IsString()
    phone: String;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: "Sua senha deve conter 6 ou mais  caracteres"})
    password: String;
    
}