import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {Link} from './link.model';
import {Review} from './review.model';

export type CourseDocument = Course & Document;
export type CourseDataDocument = CourseData & Document;

@Schema({timestamps: true, id: true})
export class CourseData {
  @Prop({required: true, name: 'title', type: String, default: ''})
  title: string;

  @Prop({required: true, name: 'description', type: String, default: ''})
  description: string;

  @Prop({required: true, name: 'videoURL', type: String, default: ''})
  videoURL: string;

  @Prop({required: true, name: 'videoThumbnail', type: Object, default: {public_id: '', url: ''}})
  videoThumbnail: {
    public_id: {
      type: String;
      required: true;
    };
    url: {
      type: String;
      required: true;
    };
  };

  @Prop({required: true, name: 'videoSelection', type: String, default: ''})
  videoSelection: string;

  @Prop({required: true, name: 'videoDuration', type: Number, default: 0})
  videoDuration: Number;

  @Prop({required: true, name: 'videoPlayer', type: String, default: ''})
  videoPlayer: String;

  @Prop({name: 'links', type: [Types.ObjectId], ref: Link.name, default: []})
  links: [Link];
}

@Schema({timestamps: true, id: true})
export class Course {
  @Prop({required: true, name: 'name', type: String, default: ''})
  name: string;

  @Prop({required: true, name: 'description', type: String, default: ''})
  description: string;

  @Prop({required: true, name: 'price', type: Number, default: 0})
  price: number;

  @Prop({required: true, name: 'discount', type: Number, default: 0})
  discount: number;

  @Prop({
    required: true,
    name: 'thumbnail',
    type: Object,
    default: {
      public_id: '',
      url: '',
    },
  })
  thumbnail: {
    public_id: {
      type: String;
      required: true;
    };
    url: {
      type: String;
      required: true;
    };
  };

  @Prop({required: true, name: 'tags', type: [String], default: []})
  tags: [string];

  @Prop({required: true, name: 'level', type: String, default: ''})
  level: string;

  @Prop({required: true, name: 'demoURL', type: String, default: ''})
  demoURL: string;

  @Prop({required: true, name: 'benefits', type: String, default: ''})
  benefits: string;

  @Prop({required: true, name: 'prerequisites', type: String, default: ''})
  prerequisites: string;

  @Prop({
    name: 'reviews',
    type: [Types.ObjectId],
    ref: Review.name,
    default: [],
  })
  reviews: [Review];

  @Prop({
    required: true,
    name: 'courseData',
    type: [Types.ObjectId],
    ref: CourseData.name,
    default: [],
  })
  courseData: [CourseData];

  @Prop({required: true, name: 'isPublished', type: Boolean, default: false})
  isPublished: boolean;

  @Prop({required: true, name: 'rating', type: Number, default: 0})
  rating: number;

  @Prop({required: true, name: 'purchased', type: Boolean, default: false})
  purchased: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
export const CourseDataSchema = SchemaFactory.createForClass(CourseData);
