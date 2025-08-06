import axios from "axios";
import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function for unauthorized error handling
export const handleUnauthorizedError = () => {
  Cookies.remove("authToken");
  // Optionally redirect to login page
  // window.location.href = '/login';
};

export const fetchAllNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        handleUnauthorizedError();
        return rejectWithValue("Authentication token is missing.");
      }

      const response = await axios.get(
        `${BASE_URL}/api/partner/notifications/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      // Transform the data to ensure consistent types
      const transformedData = response.data.data.map((notification: any) => ({
        ...notification,
        read_at: notification.read_at || null
      }));
      
      return {
        ...response.data,
        data: transformedData
      };
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "An error occurred while fetching notifications.");
      } else if (error.request) {
        return rejectWithValue("No response from server. Check your network connection.");
      } else {
        return rejectWithValue("An unexpected error occurred. Please try again.");
      }
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        handleUnauthorizedError();
        return rejectWithValue("Authentication token is missing.");
      }

      const response = await axios.post(
        `${BASE_URL}/api/partner/notifications/mark-as-read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "Failed to mark notification as read.");
      } else if (error.request) {
        return rejectWithValue("No response from server. Check your network connection.");
      } else {
        return rejectWithValue("An unexpected error occurred. Please try again.");
      }
    }
  }
);

export const addNewNotification = createAsyncThunk(
  "notifications/addNew",
  async (notification: any, { rejectWithValue }) => {
    try {
      // Transform the notification to match your frontend format if needed
      const transformedNotification = {
        ...notification,
        read_at: notification.read_at || null,
        created_at: notification.created_at || new Date().toISOString()
      };
      
      return transformedNotification;
    } catch (error: any) {
      return rejectWithValue("Failed to add new notification");
    }
  }
);