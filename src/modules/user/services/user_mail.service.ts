import {GROUP_EMAIL, IMail} from '@/core';
import {InjectQueue} from '@nestjs/bull';
import {Injectable} from '@nestjs/common';
import {Queue} from 'bull';

@Injectable()
export class UserMailService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async ping() {
    const job = await this.emailQueue.add('ping');

    return {
      message: 'Email service is running',
      data: job,
    };
  }

  async sendUserConfirmation(email: string, name: string) {
    const data: IMail = {
      from: GROUP_EMAIL,
      subject: 'User Confirmation Information',
      text: 'User Confirmation Information',
      to: email,
      // context
      link: 'http://localhost:4000',
      name: name,
    };

    const job = await this.emailQueue.add('sendUserConfirmation', data);

    return {
      message: 'User confirmation information has been sent to your email',
      data: job.id,
    };
  }

  async sendUserResetPasswordOtp(name: string, email: string, code: string) {
    const data: IMail = {
      from: GROUP_EMAIL,
      subject: 'Reset Password',
      text: 'Reset Password',
      to: email,
      // context
      code: code,
      name: name,
      email: email,
    };

    const job = await this.emailQueue.add('sendUserResetPasswordOtp', data);

    return {
      message: 'Reset password information has been sent to your email',
      data: job.id,
    };
  }

  async sendUserResetPasswordSuccess(name: string, email: string) {
    const data: IMail = {
      from: GROUP_EMAIL,
      subject: 'Reset Password Success',
      text: 'Reset Password Success',
      to: email,
      // context
      name: name,
      email: email,
    };

    const job = await this.emailQueue.add('sendUserResetPasswordSuccess', data);

    return {
      message: 'Reset password success information has been sent to your email',
      data: job.id,
    };
  }

  async sendUserVerifyCode(name: string, information: string, code: string) {
    const data: IMail = {
      from: GROUP_EMAIL,
      subject: 'Verify Code',
      text: 'Verify Code',
      to: information,
      // context
      name: name,
      information: information,
      code: code,
    };

    const job = await this.emailQueue.add('sendUserVerifyCode', data);

    return {
      message: 'Verify code information has been sent to your email',
      data: job,
    };
  }
}
