export const CACHE_TTL = 60 * 60 * 24 * 7;

export const CACHE_KEY = {
  user: 'user',
  cart: 'cart',
  product: 'product',
  brand: 'brand',
  category: 'category',
  order: 'order',
  orderItem: 'order_item',
  verifyAuthOTP: 'verify_auth_otp',
  verifyOtp: 'verify_otp',
};

export const CACHE_KEY_TTL = {
  user: 60 * 60,
  cart: 60 * 60,
  product: 60 * 60,
  brand: 60 * 60,
  category: 60 * 60,
  order: 60 * 60,
  orderItem: 60 * 60,
  verifyAuthOTP: 60 * 5,
  verifyOtp: 60 * 5,
};
