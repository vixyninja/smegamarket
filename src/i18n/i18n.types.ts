export interface I18nTranslations {
  content: {
    auth: {
      email: {
        notValid: string;
        required: string;
      };
      password: {
        required: string;
        minlength: string;
      };
      passwordConfirmation: {
        required: string;
        mustMatch: string;
      };
      firstName: {
        required: string;
      };
      lastName: {
        required: string;
      };
      deviceType: {
        required: string;
      };
      deviceToken: {
        required: string;
      };
    };
  };
  validation: {
    NOT_EMPTY: string;
    INVALID_EMAIL: string;
    INVALID_PHONE: string;
    MIN: string;
    MAX: string;
  };
}