import { CanActivate, ExecutionContext, ForbiddenException, mixin } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FORBIDDEN_ACCESS } from '../auth.constants';

export const RoleGuard = (...roles: string[]) => {
	class RoleGuardMixin implements CanActivate {
		canActivate(
			context: ExecutionContext,
		): boolean | Promise<boolean> | Observable<boolean> {
			const request = context.switchToHttp().getRequest();
			const userRole = request.user.role;
			const isAccessed = roles.includes(userRole);

			if (isAccessed) return true;

			throw new ForbiddenException(FORBIDDEN_ACCESS);
		}
	}

	const guard = mixin(RoleGuardMixin);

	return guard;
};
