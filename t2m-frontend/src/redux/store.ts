import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { authReducer } from "@/redux/authSlice";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import createTransform from 'redux-persist/es/createTransform';

// Tạo một storage không làm gì cho SSR
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// Chọn storage tùy theo môi trường
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

// Cấu hình expire transform
const expireTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState, key) => {
    // return state không thay đổi, không cần transform gì cả
    return {
      //@ts-ignore
      ...inboundState,
      _persistExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 4 giờ không thao tác tự động hết
    };
  },
  // transform state being rehydrated
  (outboundState, key) => {
    if (outboundState && outboundState._persistExpiresAt) {
      if (Date.now() > outboundState._persistExpiresAt) {
        // Dữ liệu đã hết hạn
        return null; // Trả về null để state được reset
      }
    }
    return outboundState;
  },
  { whitelist: ['user'] }
);

const authPersistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["access_token", "user"],
  transforms: [expireTransform] // áp dụng transform với thời gian hết hạn
};

const persistedReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineReducers({
  auth: persistedReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
