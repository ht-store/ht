import Redis from "ioredis";
import config from "src/config";

export const redisConnection = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  maxRetriesPerRequest: null,
});

// interface IRedisCache {
//   get(key: string): Promise<Record<string, any> | null>
//   set()
// }

class RedisCache {
  private client: Redis;

  constructor() {
    // Initialize connection to Redis
    this.client = redisConnection;

    // Listen for errors from RedisClient
    this.client.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  // Method to get data from cache
  set(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.set(key, JSON.stringify(value), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply ? JSON.parse(reply) : null);
        }
      });
    });
  }

  del(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  hset(key: string, field: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.hset(key, field, JSON.stringify(value), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  hget(key: string, field: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.hget(key, field, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply ? JSON.parse(reply) : null);
        }
      });
    });
  }

  hgetAll(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.hgetall(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          const parsedReply: { [key: string]: any } = {};
          if (reply) {
            Object.keys(reply).forEach((field) => {
              parsedReply[field] = JSON.parse(reply[field]);
            });
          }
          resolve(parsedReply);
        }
      });
    });
  }

  lpush(key: string, value: any): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.lpush(key, JSON.stringify(value), (err, length) => {
        if (err) {
          reject(err);
        } else {
          if (typeof length === "number") {
            resolve(length);
          } else {
            reject(new Error("Unexpected response from Redis"));
          }
        }
      });
    });
  }

  lrem(key: string, count: number, value: any): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.lrem(
        key,
        count,
        JSON.stringify(value),
        (err, removedCount) => {
          if (err) {
            reject(err);
          } else {
            resolve(removedCount ?? 0); // Thêm ?? 0 để đảm bảo resolved với một giá trị number
          }
        }
      );
    });
  }

  linsert(
    key: string,
    before: boolean,
    pivot: any,
    value: any
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      if (before) {
        this.client.linsert(
          key,
          "BEFORE",
          JSON.stringify(pivot),
          JSON.stringify(value),
          (err, length) => {
            if (err) {
              reject(err);
            } else {
              resolve(length ?? 0);
            }
          }
        );
      } else {
        this.client.linsert(
          key,
          "AFTER",
          JSON.stringify(pivot),
          JSON.stringify(value),
          (err, length) => {
            if (err) {
              reject(err);
            } else {
              resolve(length ?? 0);
            }
          }
        );
      }
    });
  }
}

export default new RedisCache();
