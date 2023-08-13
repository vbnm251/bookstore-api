export const USER_COLLECTION = 'Users';
export const USER_MODEL = 'USER_MODEL';
export const USER_ALREADY_EXISTS = 'Пользователь с таким email уже существует';
export const USER_NOT_FOUND = (text: 'email' | 'username') =>
	`Пользователя с таким ${text} не существует`;
export const WRONG_PASSWORD = 'Неверный пароль';
