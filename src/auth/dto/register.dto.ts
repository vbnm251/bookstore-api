import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
	@IsEmail()
	email: string;

	@IsString()
	name: string;

	@IsString()
	username: string;

	@IsString()
	@MinLength(5)
	@MaxLength(50)
	password: string;
}
