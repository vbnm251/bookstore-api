import { ValidationPipeOptions } from '@nestjs/common';

export const validationOptions: ValidationPipeOptions = {
	enableDebugMessages: true,
	stopAtFirstError: true,
};
