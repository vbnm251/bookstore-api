import { SetMetadata } from '@nestjs/common';

export const GetRole = (role: string) => SetMetadata('get-role', role);
