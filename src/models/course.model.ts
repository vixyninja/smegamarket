import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {Link} from './link.model';
import {Review} from './review.model';

export type CourseDocument = Course & Document;
export type CourseDataDocument = CourseData & Document;

@Schema({timestamps: true, id: true})
export class CourseData {
  @Prop({required: true, trim: true, name: 'title', type: String})
  title: string;

  @Prop({required: true, trim: true, name: 'description', type: String})
  description: string;

  @Prop({required: true, trim: true, name: 'videoURL', type: String})
  videoURL: string;

  @Prop({required: true, trim: true, name: 'videoThumbnail', type: Object})
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

  @Prop({required: true, trim: true, name: 'videoSelection', type: String})
  videoSelection: string;

  @Prop({required: true, trim: true, name: 'videoDuration', type: Number})
  videoDuration: Number;

  @Prop({required: true, trim: true, name: 'videoPlayer', type: String})
  videoPlayer: String;

  @Prop({required: true, trim: true, name: 'link', type: Types.ObjectId, ref: Link.name, default: []})
  links: Link[];
}

@Schema({timestamps: true, id: true})
export class Course {
  @Prop({required: true, trim: true, name: 'name', type: String})
  name: string;

  @Prop({required: true, trim: true, name: 'description', type: String})
  description: string;

  @Prop({required: true, trim: true, name: 'price', type: Number})
  price: number;

  @Prop({required: true, trim: true, name: 'discount', type: Number, default: 0})
  discount: number;

  @Prop({required: true, trim: true, name: 'thumbnail', type: Object})
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

  @Prop({required: true, trim: true, name: 'tags', type: [String], default: []})
  tags: [string];

  @Prop({required: true, trim: true, name: 'level', type: String})
  level: string;

  @Prop({required: true, trim: true, name: 'demoURL', type: String})
  demoURL: string;

  @Prop({required: true, trim: true, name: 'benefits', type: String, default: ''})
  benefits: string;

  @Prop({required: true, trim: true, name: 'prerequisites', type: String, default: ''})
  prerequisites: string;

  // @Prop({
  //   required: true,
  //   trim: true,
  //   name: 'reviews',
  //   type: [Types.ObjectId],
  //   ref: Review.name,
  // })
  // reviews: [Review];

  @Prop({required: true, trim: true, name: 'courseData', type: [Types.ObjectId], ref: CourseData.name})
  courseData: [CourseData];

  @Prop({required: true, trim: true, name: 'isPublished', type: Boolean, default: false})
  isPublished: boolean;

  @Prop({required: true, trim: true, name: 'rating', type: Number, default: 0})
  rating: number;

  @Prop({required: true, trim: true, name: 'purchased', type: Number, default: 0})
  purchased: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
export const CourseDataSchema = SchemaFactory.createForClass(CourseData);
