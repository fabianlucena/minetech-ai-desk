import crypto from 'crypto';

export function generateToken(length = 64) {
  length ||= 64;
  const buffer = crypto.randomBytes(length * 3 / 4 + 1);
  const base64 = buffer.toString('base64').substring(0, length).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return base64;
}
