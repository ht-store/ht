import { produce } from 'immer';
import { create } from 'zustand';

export type AppStoreType = {
  dummy: any;
};

export const store = (set: Function) => ({
  dummy: null,
  setDummy: (dummy: any) =>
    set(
      produce((state: AppStoreType) => {
        state.dummy = dummy;
      })
    ),
});

export const useAppStore = create<AppStoreType>(store);
