import {IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import {HttpBadRequest} from 'src/core';

export class UpdatePasswordDTO {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;

  constructor(oldPassword: string, newPassword: string) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;

    if (!this.oldPassword || !this.newPassword) {
      throw new HttpBadRequest('Old password or new password is empty');
    }

    if (this.oldPassword === this.newPassword) {
      throw new HttpBadRequest('Old password and new password are the same');
    }

    if (this.newPassword.length < 6 || this.oldPassword.length < 6) {
      throw new HttpBadRequest('New password must be at least 6 characters');
    }
  }
}
