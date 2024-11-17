type DefaultFieldInEntity = 'id' | 'createdAt' | 'updatedAt';

export type BasePropsType<T> = {
  [K in Exclude<keyof T, DefaultFieldInEntity>]: T[K];
};
