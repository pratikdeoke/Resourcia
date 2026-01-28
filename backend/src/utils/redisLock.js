import redis from '../config/redis.js';

const LOCK_TTL_MS = 10_000;

export const acquireLock = async (key) => {
  const lockKey = `lock:${key}`;

  const result = await redis.set(
    lockKey,
    'locked',
    'PX',
    LOCK_TTL_MS,
    'NX'
  );

  return result === 'OK';
};

export const releaseLock = async (key) => {
  const lockKey = `lock:${key}`;
  await redis.del(lockKey);
};