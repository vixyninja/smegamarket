const CACHE_KEY = {
  USER: 'USER',
  CART: 'CART',
  PRODUCT: 'PRODUCT',
  BRAND: 'BRAND',
  CATEGORY: 'CATEGORY',
  ORDER: 'ORDER',
  ORDER_ITEM: 'ORDER_ITEM',
  VERIFY_FORGOT_PASSWORD: 'VERIFY_FORGOT_PASSWORD',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  VERIFY_PHONE: 'VERIFY_PHONE',
};

const CACHE_KEY_TTL = {
  ONE_MINUTE: 60,
  ONE_HOUR: 60 * 60,
  USER: 60 * 60,
  CART: 60 * 60,
  PRODUCT: 60 * 60,
  BRAND: 60 * 60,
  CATEGORY: 60 * 60,
  ORDER: 60 * 60,
  ORDER_ITEM: 60 * 60,
  VERIFY_FORGOT_PASSWORD: 60 * 5,
  VERIFY_EMAIL: 60 * 5,
  VERIFY_PHONE: 60 * 5,
};

export {CACHE_KEY, CACHE_KEY_TTL};
