import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { FORBIDDEN_ACCESS } from '../auth.constants';
import { compare } from 'bcrypt';

@Injectable()
export class RefreshJwtGuard extends AuthGuard('refresh-jwt') {}

@Injectable()
export class RefreshGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const request = ctx.switchToHttp().getRequest();
		const userId: string = request.user.id;
		const refreshToken: string = request.user.refreshToken;

		const user = await this.userService.findById(userId);
		if (!user || !user.refreshToken) {
			throw new ForbiddenException(FORBIDDEN_ACCESS);
		}
		const isCorrectRefreshToken = await compare(refreshToken, user.refreshToken);

		return isCorrectRefreshToken;
	}
}
