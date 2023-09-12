import {HttpService} from '@nestjs/axios';
import {Inject, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {AxiosResponse} from 'axios';
import * as firebaseAuth from 'firebase/auth';
import {Observable, catchError, map, throwError} from 'rxjs';
import {FIREBASE_API_KEY, FIREBASE_SECURE_TOKEN_URL} from 'src/configs';
import {HttpBadRequest, HttpInternalServerError, HttpUnauthorized} from 'src/core';
import {HttpOk, HttpSuccessResponse} from 'src/interface';
import {ForgotPasswordDTO, LoginDTO, RegisterDTO} from './dto';
import {TokenType} from './types';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FirebaseAuth') private readonly firebaseAuth: firebaseAuth.Auth,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async register(registerDTO: RegisterDTO) {
    try {
      const {email, password} = registerDTO;
      let user: any;
      if (user) {
        throw new HttpBadRequest('Email already exists');
      }
      user = await firebaseAuth.createUserWithEmailAndPassword(this.firebaseAuth, email, password);
      if (!user) {
        throw new HttpBadRequest('Register failed');
      }
      throw new HttpSuccessResponse<TokenType>(
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
      user = await firebaseAuth.signInWithEmailAndPassword(this.firebaseAuth, loginDTO.email, loginDTO.password);
      if (!user) {
        throw new HttpBadRequest('Login failed');
      }
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
}
