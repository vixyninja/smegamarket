import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type LinkDocument = Link & Document;

@Schema({timestamps: true, id: true})
export class Link {
  @Prop({name: 'title', type: String, default: ''})
  title: string;

  @Prop({name: 'url', type: String, default: ''})
  url: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
