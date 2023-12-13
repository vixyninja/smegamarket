import {uid} from 'uid/single';

export const randomOTP = (length: number = 6): string => {
  return uid(length);
};
