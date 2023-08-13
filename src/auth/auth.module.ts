import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { USER_MODEL } from './auth.constants';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/configs/jwt.config';
import { AdminJwtStrategy } from './strategy/admin-jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [
		// PassportModule,
		ConfigModule,
		MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
	providers: [AuthService, UserService, AdminJwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
