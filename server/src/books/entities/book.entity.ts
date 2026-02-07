import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true, index: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Author', required: true })
  author: Types.ObjectId;

  // Keep legacy fields for backward compatibility
  @Prop()
  author_first_name: string;

  @Prop()
  author_last_name: string;

  @Prop({ required: true })
  publishing_year: number;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 0 })
  num_of_favorites: number;

  @Prop()
  description: string;

  @Prop()
  isbn: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
