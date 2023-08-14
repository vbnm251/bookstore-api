import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getAccessConfig } from 'src/configs/jwt.config';
import { ACCESS_TOKEN_SERVICE } from '../auth.constants';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: getAccessConfig,
		}),
	],
	providers: [{ provide: ACCESS_TOKEN_SERVICE, useExisting: JwtService }],
	exports: [ACCESS_TOKEN_SERVICE],
})
export class AccessTokenModule {}
