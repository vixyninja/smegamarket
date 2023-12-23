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
      confirmPassword: {
        required: string;
        mustMatch: string;
        minlength: string;
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
      signUp: {
        success: string;
        error: string;
        emailExists: string;
        phoneExists: string;
      };
      signIn: {
        success: string;
        error: string;
        wrongCredentials: string;
        notFound: string;
      };
      refreshToken: {
        success: string;
        error: string;
        missing: string;
      };
    };
    profile: {
      update: {
        success: string;
        error: string;
        role: string;
        avatar: string;
        cover: string;
        phone: string;
        email: string;
        firstName: string;
        lastName: string;
      };
      get: {
        success: string;
        error: string;
      };
    };
  };
  validation: {
    NOT_EMPTY: string;
    MAX_LENGTH: string;
    MIN_LENGTH: string;
    INVALID_DATE: string;
    EQUALS: string;
    NOT_EQUALS: string;
    PASSWORDS_MUST_MATCH: string;
    GREATER_THAN: string;
    IS_EMAIL: string;
    IS_PHONE: string;
    IS_DATE: string;
    IS_NUMBER: string;
    IS_BOOLEAN: string;
    IS_STRING: string;
  };
}
