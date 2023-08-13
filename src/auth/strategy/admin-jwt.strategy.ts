import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../user.model';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: configService.get('JWT_SECRET'),
		});
	}

	validate(payload: { role: string }) {
		if (payload.role == Roles.ADMIN) {
			return payload.role;
		}
	}
}
