import {SetMetadata} from '@nestjs/common';

export const RESPONSE_MESSAGE = 'responseMessage';
export const ResponseMessage = () => SetMetadata(RESPONSE_MESSAGE, true);
