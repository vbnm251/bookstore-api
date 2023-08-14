import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
	@IsString()
	@IsOptional()
	username?: string;

	@ValidateIf((login: LoginDto) => Boolean(login.username))
	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	password: string;
}
