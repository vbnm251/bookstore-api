import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
import { readFile } from 'fs-extra';
import { path } from 'app-root-path';
import { resolve } from 'path';
import { Roles, User, UserInfo } from 'src/auth/entities/user.entity';
import { readFileSync } from 'fs';
import { Types } from 'mongoose';

type TokenType = 'access' | 'refresh';

export const JwtTokenExpiresIn = '30d'; // 1 hour (30d for better developing)
export const RefreshTokenExpiresIn = '20d';

const algorithm = 'RS256';

export interface JwtPaylod extends UserInfo {
	id: Types.ObjectId;
}

const accessSignOptions: JwtSignOptions = {
	algorithm: algorithm,
	expiresIn: JwtTokenExpiresIn,
};

const refreshSignOptions: JwtSignOptions = {
	algorithm: algorithm,
	expiresIn: RefreshTokenExpiresIn,
};

export const getAccessConfig = async (): Promise<JwtModuleOptions> => {
	return {
		privateKey: await getTokenKey('private', 'access'),
		publicKey: await getTokenKey('public', 'access'),
		signOptions: accessSignOptions,
	};
};

export const getRefreshConfig = async (): Promise<JwtModuleOptions> => {
	return {
		privateKey: await getTokenKey('private', 'refresh'),
		publicKey: await getTokenKey('public', 'refresh'),
		signOptions: refreshSignOptions,
	};
};

export const getJwtStrategyOptions = (tokenType: TokenType) => {
	const privateKey = readFileSync(resolve(path, 'keys', tokenType, 'private.pem'), {
		encoding: 'utf-8',
	});

	return {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		ignoreExpiration: false,
		secretOrKey: privateKey,
		algorithms: [algorithm],
		passReqToCallback: true,
	};
};

const getTokenKey = async (keyType: 'private' | 'public', tokenType: TokenType) => {
	const key = await readFile(resolve(path, 'keys', tokenType, keyType + '.pem'), {
		encoding: 'utf-8',
	});
	if (!key) {
		throw new Error('Unable to read keys');
	}

	return key;
};
