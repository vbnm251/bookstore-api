import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPaylod, getJwtStrategyOptions } from 'src/configs/jwt.config';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
	constructor() {
		super(getJwtStrategyOptions('access'));
	}

	validate(req: never, payload: JwtPaylod) {
		return payload;
	}
}
