import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_COLLECTION } from '../auth.constants';
import { Types } from 'mongoose';

export enum Roles {
	ADMIN = 'admin',
	USER = 'user',
}

export type UserInfo = Omit<User, 'passwordHash' | 'refreshToken' | '_id'>;

@Schema({
	timestamps: true,
	collection: USER_COLLECTION,
	versionKey: 'version',
	toJSON: {
		virtuals: true,
		transform: function (doc, ret) {
			delete ret._id;
		},
	},
})
export class User {
	_id: Types.ObjectId;

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

UserSchema.virtual('id').get(function () {
	return this._id.toHexString();
});
