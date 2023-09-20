import {IsNotEmpty} from 'class-validator';

export class UpdateProfileDTO {
  @IsNotEmpty()
  name: string;
}
