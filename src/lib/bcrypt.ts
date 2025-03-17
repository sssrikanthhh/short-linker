import bcrypt from 'bcryptjs';

export const hashValue = async (value: string, salt?: number) =>
  await bcrypt.hash(value, salt || 10);

export const compareValue = async (value: string, hash: string) =>
  await bcrypt.compare(value, hash).catch(() => false);
