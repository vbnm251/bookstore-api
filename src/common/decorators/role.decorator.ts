import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Role = createParamDecorator((data: never, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	console.log(request.user);
	return request.user.role;
});
