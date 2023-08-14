import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { USER_MODEL } from './auth.constants';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { AccessJwtStrategy } from './strategies/access.strategy';
import { PassportModule } from '@nestjs/passport';
import { RefreshJwtStrategy } from './strategies/refresh-strategy';
import { AccessTokenModule } from './auth-modules/access.module';
import { RefreshTokenModule } from './auth-modules/refresh.module';

@Module({
	imports: [
		PassportModule,
		ConfigModule,
		MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),
		AccessTokenModule,
		RefreshTokenModule,
	],
	providers: [AuthService, UserService, AccessJwtStrategy, RefreshJwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
