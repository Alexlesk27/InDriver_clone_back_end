import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phone?: string;

    image?: string;
    notification_token?: string;
}
