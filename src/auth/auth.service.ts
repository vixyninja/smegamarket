import {HttpService} from '@nestjs/axios';
import {Inject, Injectable} from '@nestjs/common';
import {AxiosResponse} from 'axios';
import * as firebaseAuth from 'firebase/auth';
import {Observable, catchError, map, throwError} from 'rxjs';
import {FIREBASE_API_KEY, FIREBASE_SECURE_TOKEN_URL, MailService} from 'src/configs';
import {HttpBadRequest, HttpInternalServerError, HttpUnauthorized} from 'src/core';
import {HttpOk, HttpSuccessResponse} from 'src/interface';
import {UserService} from 'src/modules/user/user.service';
import {ForgotPasswordDTO, LoginDTO, RegisterDTO} from './dto';
import {TokenType} from './types';
import {RedisxService} from 'src/configs/redisx/redisx.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FirebaseAuth') private readonly firebaseAuth: firebaseAuth.Auth,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly redisService: RedisxService,
  ) {}

  async register(registerDTO: RegisterDTO) {
    try {
      let user: any;
      let userModel: any;
      // check email exists
      userModel = await this.userService.findOneByEmail(registerDTO.email);

      if (userModel) {
        throw new HttpBadRequest('Email already exists');
      }

      // create user with email and password to firebase
      user = await firebaseAuth.createUserWithEmailAndPassword(
        this.firebaseAuth,
        registerDTO.email,
        registerDTO.password,
      );

      // handle error when create user firebase
      if (!user) {
        throw new HttpBadRequest('Register failed');
      }

      // create user to mongodb
      userModel = await this.userService.create({
        firebase_uid: user.user.uid,
        email: user.user.email,
        name: user.user.displayName || 'Người dùng mới',
      });

      // handle error when create user
      if (!user || !userModel) {
        throw new HttpBadRequest('Register failed');
      }

      await firebaseAuth.updateProfile(user.user, {
        displayName: userModel.name,
      });
      await firebaseAuth.sendEmailVerification(user.user);
      await this.mailService.sendUserConfirmation(user.user.email, userModel.name);
      // response token
      return new HttpSuccessResponse<TokenType>(
        {
          accessToken: await firebaseAuth.getIdToken(user.user),
          refreshToken: user.user.refreshToken,
        },
        'Register successfully',
      );
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        throw new HttpBadRequest('Email not exists');
      } else if (e.code === 'auth/wrong-password') {
        throw new HttpBadRequest('Password is incorrect');
      } else if (e.code === 'auth/too-many-requests') {
        throw new HttpBadRequest('Too many requests, please try again later');
      } else if (e.code === 'auth/invalid-email') {
        throw new HttpBadRequest('Email is invalid');
      } else if (e.code === 'auth/user-disabled') {
        throw new HttpBadRequest('User is disabled');
      } else if (e.code === 'auth/operation-not-allowed') {
        throw new HttpBadRequest('Operation not allowed');
      } else if (e.code === 'auth/weak-password') {
        throw new HttpBadRequest('Password is too weak');
      } else if (e.code === 'auth/email-already-in-use') {
        throw new HttpBadRequest('Email already exists');
      }
      throw new HttpInternalServerError(e.message || 'Server error');
    }
  }

  async login(loginDTO: LoginDTO) {
    try {
      let user: any;

      // login with email and password to firebase
      user = await firebaseAuth.signInWithEmailAndPassword(this.firebaseAuth, loginDTO.email, loginDTO.password);

      // handle error when login
      if (!user) {
        throw new HttpBadRequest('Login failed');
      }

      // response token
      return new HttpSuccessResponse<TokenType>(
        {
          accessToken: await firebaseAuth.getIdToken(user.user, true),
          refreshToken: user.user.refreshToken,
        },
        'Login successfully',
      );
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        throw new HttpBadRequest('Email not exists');
      } else if (e.code === 'auth/wrong-password') {
        throw new HttpBadRequest('Password is incorrect');
      } else if (e.code === 'auth/too-many-requests') {
        throw new HttpBadRequest('Too many requests, please try again later');
      } else if (e.code === 'auth/invalid-email') {
        throw new HttpBadRequest('Email is invalid');
      } else if (e.code === 'auth/user-disabled') {
        throw new HttpBadRequest('User is disabled');
      } else if (e.code === 'auth/operation-not-allowed') {
        throw new HttpBadRequest('Operation not allowed');
      } else if (e.code === 'auth/weak-password') {
        throw new HttpBadRequest('Password is too weak');
      } else if (e.code === 'auth/email-already-in-use') {
        throw new HttpBadRequest('Email already exists');
      }
      throw new HttpInternalServerError(e.message || 'Server error');
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordDTO) {
    try {
      let user: any;

      if (user == null) {
        throw new HttpBadRequest('Email not exists');
      }
      await firebaseAuth.sendPasswordResetEmail(this.firebaseAuth, forgotPassword.email);
      return new HttpOk('Send email successfully, please check your email');
    } catch (e) {
      throw new HttpInternalServerError('Server error');
    }
  }

  async loginWithGoogle(idToken: string, accessToken: string) {
    try {
      const credential = firebaseAuth.GoogleAuthProvider.credential(idToken, accessToken);
      const user = await firebaseAuth.signInWithCredential(this.firebaseAuth, credential);
      if (!user) {
        throw new HttpBadRequest('Login failed');
      }
      throw new HttpSuccessResponse<TokenType>(
        {
          accessToken: await firebaseAuth.getIdToken(user.user),
          refreshToken: user.user.refreshToken,
        },
        'Login successfully',
      );
    } catch (e) {
      throw new HttpInternalServerError('Server error');
    }
  }

  async refreshToken(refreshToken: string): Promise<Observable<AxiosResponse<any, any>>> {
    try {
      const data = this.httpService
        .post(
          FIREBASE_SECURE_TOKEN_URL + `=${FIREBASE_API_KEY}`,
          {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          },
          {
            headers: {
              'Content-Type': 'x-www-form-urlencoded',
            },
          },
        )
        .pipe(map((res) => res.data))
        .pipe(
          catchError((e) => {
            if (e.code === 'ERR_BAD_REQUEST') {
              const error = new HttpUnauthorized('Refresh token is invalid');
              return throwError(() => error);
            } else if (e.code === 'TOKEN_EXPIRED') {
              const error = new HttpUnauthorized('Refresh token is invalid');
              return throwError(() => error);
            } else if (e.code === 'USER_DISABLED') {
              const error = new HttpUnauthorized('User is disabled');
              return throwError(() => error);
            } else if (e.code === 'USER_NOT_FOUND') {
              const error = new HttpUnauthorized('User not found');
              return throwError(() => error);
            } else if (e.code === 'INVALID_REFRESH_TOKEN') {
              const error = new HttpUnauthorized('Refresh token is invalid');
              return throwError(() => error);
            } else if (e.code === 'INVALID_GRANT_TYPE') {
              const error = new HttpUnauthorized('Refresh token is invalid');
              return throwError(() => error);
            } else if (e.code === 'MISSING_REFRESH_TOKEN') {
              const error = new HttpUnauthorized('Refresh token is invalid');
              return throwError(() => error);
            } else {
              const error = new HttpInternalServerError('Server error');
              return throwError(() => error);
            }
          }),
        );
      return data;
    } catch (e) {
      throw new HttpInternalServerError('Server error');
    }
  }

  async helloServer() {
    const data = await this.redisService.getKey('hello');

    if (!data) {
      await this.redisService.setKey('hello', 'hello world');
    }
    return data;
  }
}
