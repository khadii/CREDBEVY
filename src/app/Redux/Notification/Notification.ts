import { createSlice } from "@reduxjs/toolkit";
import { fetchAllNotifications, markNotificationAsRead, addNewNotification } from "./NotificationsThunk";

interface NotificationData {
  message: string;
  user_name?: string;
  loan_amount?: string;
  loan_id?: string;
  timestamp: string;
  status?: string;
}

export interface Notification {
  id: string;
  type: 'request' | 'transactions' | 'accounts' | 'others';
  title: string | null;
  module: string | null;
  module_id: string | null;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  markAsReadLoading: boolean;
  markAsReadError: string | null;
  hasUnseenNotifications: boolean; // New state for visual indicator
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
  markAsReadLoading: false,
  markAsReadError: null,
  hasUnseenNotifications: false
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
      state.markAsReadError = null;
      state.hasUnseenNotifications = false;
    },
    resetUnseenFlag: (state) => {
      state.hasUnseenNotifications = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Notifications
      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.error === false) {
          state.notifications = action.payload.data;
          state.unreadCount = action.payload.data.filter((n: Notification) => !n.read_at).length;
          state.hasUnseenNotifications = false; 
        } else {
          state.error = action.payload.message || "Failed to fetch notifications";
        }
      })
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch notifications";
      })
      
      // Mark Notification As Read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.markAsReadLoading = true;
        state.markAsReadError = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.markAsReadLoading = false;
        if (action.payload.error === false) {
          const updatedNotification = action.payload.data;
          const index = state.notifications.findIndex(n => n.id === updatedNotification.id);
          
          if (index !== -1) {
            state.notifications[index] = updatedNotification;
            state.unreadCount = state.notifications.filter(n => !n.read_at).length;
          }
        } else {
          state.markAsReadError = action.payload.message || "Failed to mark notification as read";
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.markAsReadLoading = false;
        state.markAsReadError = action.payload as string || "Failed to mark notification as read";
      })
      
      // Add New Notification (Pusher)
      .addCase(addNewNotification.fulfilled, (state, action) => {
        // Check if notification already exists to prevent duplicates
        const exists = state.notifications.some(n => n.id === action.payload.id);
        if (!exists) {
          // Add new notification to the beginning of the array
          state.notifications = [action.payload, ...state.notifications];
          
          // Increment unread count if notification is unread
          if (!action.payload.read_at) {
            state.unreadCount += 1;
            state.hasUnseenNotifications = true;
          }
          
          // Optional: Limit the number of stored notifications
          if (state.notifications.length > 100) {
            state.notifications = state.notifications.slice(0, 100);
          }
        }
      });
  },
});

export const { clearNotifications, resetUnseenFlag } = notificationSlice.actions;

// Selectors
export const selectAllNotifications = (state: { notifications: NotificationState }) => 
  state.notifications.notifications;

export const selectUnreadNotifications = (state: { notifications: NotificationState }) => 
  state.notifications.notifications.filter(notification => !notification.read_at);

export const selectUnreadCount = (state: { notifications: NotificationState }) => 
  state.notifications.unreadCount;

export const selectNotificationsLoading = (state: { notifications: NotificationState }) => 
  state.notifications.loading;

export const selectNotificationsError = (state: { notifications: NotificationState }) => 
  state.notifications.error;

export const selectMarkAsReadLoading = (state: { notifications: NotificationState }) =>
  state.notifications.markAsReadLoading;

export const selectMarkAsReadError = (state: { notifications: NotificationState }) =>
  state.notifications.markAsReadError;

export const selectHasUnseenNotifications = (state: { notifications: NotificationState }) =>
  state.notifications.hasUnseenNotifications;

export default notificationSlice.reducer;