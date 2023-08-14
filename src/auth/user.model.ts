import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USER_COLLECTION } from './auth.constants';

export enum Roles {
	ADMIN = 'admin',
	COMMON = 'common',
}

@Schema({
	timestamps: true,
	collection: USER_COLLECTION,
	versionKey: 'version',
})
export class UserModel {
	@Prop({ unique: true })
	username: string;

	@Prop({ unique: true })
	email: string;

	@Prop()
	passwordHash: string;

	@Prop({ enum: Roles, required: true })
	role: Roles;

	@Prop()
	refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
