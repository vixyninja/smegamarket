import {IsNotEmpty} from 'class-validator';

export class RefreshDTO {
  @IsNotEmpty({message: 'Refresh token is required'})
  refreshToken: string;
}
