import {HttpException} from '@nestjs/common';

export const HandlerFilter = (left: any, right: any) => {
  if (left instanceof HttpException) {
    return {
      message: `${left.name}: ${left.message}`,
      status: left.getStatus(),
    };
  }

  if (right.meta) {
    return {
      message: right.message,
      status: right.status,
      data: right.data,
      meta: right.meta,
    };
  }

  return {
    message: right.message,
    status: right.status,
    data: right.data,
  };
};
