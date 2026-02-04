import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, Max, Min } from "class-validator";
import { UserRole } from "./user.enum";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @Prop({ required: true })
    @Max(255, { message: 'Password is too long. Maximum length is $constraint1 characters' })
    @Min(8, { message: 'Password is too short. Minimum length is $constraint1 characters' })
    password: string;

    @Prop({ required: true })
    @Max(100, { message: 'Full name is too long. Maximum length is $constraint1 characters' })
    @Min(1, { message: 'Full name is too short. Minimum length is $constraint1 characters' })
    full_name: string;

    @Prop({ default: UserRole.USER })
    role: UserRole = UserRole.USER;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);