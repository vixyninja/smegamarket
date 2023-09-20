import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type LinkDocument = Link & Document;

@Schema({timestamps: true, id: true})
export class Link {
  @Prop({required: true, trim: true, name: 'title', type: String})
  title: string;

  @Prop({required: true, trim: true, name: 'url', type: String})
  url: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
