import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRefreshConfig } from 'src/configs/jwt.config';
import { REFRESH_TOKEN_SERVICE } from '../auth.constants';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: getRefreshConfig,
		}),
	],
	providers: [{ provide: REFRESH_TOKEN_SERVICE, useExisting: JwtService }],
	exports: [REFRESH_TOKEN_SERVICE],
})
export class RefreshTokenModule {}
