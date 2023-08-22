import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserId = createParamDecorator((data: never, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.user.id;
});
