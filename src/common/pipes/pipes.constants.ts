export const INVALID_OBJECTID = 'Invalid ObjectId';

export const not_includes = (values: readonly any[]) =>
	`Значение должно быть одним из следующих ${values.join(', ')}`;
