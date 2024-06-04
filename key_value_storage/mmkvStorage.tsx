import { MMKV } from 'react-native-mmkv';
import { PersistConfig } from 'redux-persist/es/types';

export const MMKVStorage = new MMKV();

const mmkvStorage = {
  getItem: async (key: string) => {
    const value = MMKVStorage.getString(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (key: string, value: any) => {
    MMKVStorage.set(key, JSON.stringify(value));
  },
  removeItem: async (key: string) => {
    MMKVStorage.delete(key);
  },
};

export const createMMKVStorage = (): PersistConfig<any, any, any, any>['storage'] => {
  return {
    ...mmkvStorage,
  };
};
