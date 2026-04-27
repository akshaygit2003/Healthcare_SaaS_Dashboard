import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type PermissionState = 'unknown' | 'granted' | 'denied' | 'unsupported';

type UiState = {
  notificationPermission: PermissionState;
  serviceWorkerRegistered: boolean;
};

const initialState: UiState = {
  notificationPermission: 'unknown',
  serviceWorkerRegistered: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNotificationPermission: (state, action: PayloadAction<PermissionState>) => {
      state.notificationPermission = action.payload;
    },
    setServiceWorkerRegistered: (state, action: PayloadAction<boolean>) => {
      state.serviceWorkerRegistered = action.payload;
    }
  }
});

export const { setNotificationPermission, setServiceWorkerRegistered } = uiSlice.actions;
export default uiSlice.reducer;
