export class CreateUserDto{
    name: String;
    lastName: String;
    email: String;
    phone: String;
    password: String;
    image?: String;
    notification_token?: String
}