import * as md5 from 'md5';

export function hashPasswordMd5(password = CUSTOMER_DEFAULT_PASSWORD) {
  return md5(password);
}

export const CUSTOMER_DEFAULT_PASSWORD = '12345';
