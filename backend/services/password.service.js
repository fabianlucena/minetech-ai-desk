import argon2 from 'argon2';

export default class PasswordService {
  constructor() {
  }

  async hashPassword(password) {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1
    });

    return hash;
  }

  async verifyPassword(hash, password) {
    return await argon2.verify(hash, password);
  }
}