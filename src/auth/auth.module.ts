import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities';
import { USER_MODEL } from './auth.constants';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { AccessJwtStrategy, RefreshJwtStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenModule, RefreshTokenModule } from './auth-modules';
import { CART_MODEL } from 'src/cart/cart.constants';
import { CartSchema } from 'src/cart/entities';

@Module({
	imports: [
		PassportModule,
		MongooseModule.forFeature([
			{ name: USER_MODEL, schema: UserSchema },
			{ name: CART_MODEL, schema: CartSchema },
		]),
		AccessTokenModule,
		RefreshTokenModule,
	],
	providers: [AuthService, UserService, AccessJwtStrategy, RefreshJwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
