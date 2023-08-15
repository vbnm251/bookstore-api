import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_COLLECTION } from '../auth.constants';

export enum Roles {
	ADMIN = 'admin',
	USER = 'user',
}

export type UserInfo = Omit<User, 'passwordHash' | 'refreshToken'>;

@Schema({
	timestamps: true,
	collection: USER_COLLECTION,
	versionKey: 'version',
})
export class User {
	@Prop({ unique: true })
	username: string;

	@Prop()
	name: string;

	@Prop({ unique: true })
	email: string;

	@Prop()
	passwordHash: string;

	@Prop({ enum: Roles, required: true })
	role: Roles;

	@Prop()
	refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
