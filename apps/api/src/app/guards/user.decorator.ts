import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserId = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		return ctx.switchToHttp().getRequest()?.user;
	}
);
