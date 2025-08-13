// app/Redux/Notification/NotificationsThunk.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Notification } from './Notification';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const handleUnauthorizedError = () => {
  Cookies.remove('authToken');
  // Optionally redirect to login page
  // window.location.href = '/login';
};

export const fetchAllNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        handleUnauthorizedError();
        return rejectWithValue('Authentication token is missing.');
      }

      console.log('Fetching all notifications from:', `${BASE_URL}/api/partner/notifications/all`);
      const response = await axios.get(`${BASE_URL}/api/partner/notifications/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const transformedData = response.data.data.map((notification: any) => ({
        ...notification,
        read_at: notification.read_at || null,
      }));

      console.log('Fetched notifications:', transformedData);
      return {
        ...response.data,
        data: transformedData,
      };
    } catch (error: any) {
      console.error('fetchAllNotifications error:', error);
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue('Unauthorized: Please log in again.');
        }
        return rejectWithValue(error.response.data.message || 'An error occurred while fetching notifications.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Check your network connection.');
      } else {
        return rejectWithValue('An unexpected error occurred. Please try again.');
      }
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        handleUnauthorizedError();
        return rejectWithValue('Authentication token is missing.');
      }

      const response = await axios.post(
        `${BASE_URL}/api/partner/notifications/mark-as-read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Marked notification as read:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('markNotificationAsRead error:', error);
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue('Unauthorized: Please log in again.');
        }
        return rejectWithValue(error.response.data.message || 'Failed to mark notification as read.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Check your network connection.');
      } else {
        return rejectWithValue('An unexpected error occurred. Please try again.');
      }
    }
  }
);

export const addNewNotification = createAsyncThunk(
  'notifications/addNew',
  async (notification: any, { rejectWithValue }) => {
    try {
      // Handle nested or flat Pusher data
      const notificationData = notification.data || notification;
      
      // Transform Pusher event data to match Notification interface
      const transformedNotification: Notification = {
        id: notificationData.id || `temp-${Date.now()}`,
        type: notificationData.type || 'others',
        title: notificationData.title || null,
        module: notificationData.module || null,
        module_id: notificationData.module_id || null,
        data: {
          message: notificationData.message || notificationData.data?.message || 'New notification',
          user_name: notificationData.user_name || notificationData.data?.user_name || undefined,
          loan_amount: notificationData.loan_amount || notificationData.data?.loan_amount || undefined,
          loan_id: notificationData.loan_id || notificationData.data?.loan_id || undefined,
          timestamp: notificationData.timestamp || notificationData.data?.timestamp || new Date().toISOString(),
          status: notificationData.status || notificationData.data?.status || undefined,
        },
        read_at: notificationData.read_at || null,
        created_at: notificationData.created_at || new Date().toISOString(),
      };

      console.log('Transformed notification:', transformedNotification);
      return transformedNotification;
    } catch (error: any) {
      console.error('Error in addNewNotification:', error);
      return rejectWithValue('Failed to add new notification');
    }
  }
);