import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Function to clear token and potentially redirect (optional)
const handleUnauthorizedError = () => {
  Cookies.remove("authToken");
  // Optionally, you can redirect the user to the login page here.
  // For example, if you're in a React environment with React Router:
  // window.location.href = '/login';
};

export const dashboard_wallet = createAsyncThunk(
  "dashboard/wallet-balance",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");
      console.log("Token from cookies:", token);

      const response = await axios.get(
        `${BASE_URL}/api/partner/wallet-balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "Unauthorized");
      } else if (error.request) {
        return rejectWithValue(
          "No response from the server. Please check your network connection."
        );
      } else {
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);

export const _revenue = createAsyncThunk(
  "dashboard/total-revenue",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");
      console.log("Token from cookies:", token);

      const response = await axios.get(
        `${BASE_URL}/api/partner/total-revenue`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "Unauthorized");
      } else if (error.request) {
        return rejectWithValue(
          "No response from the server. Please check your network connection."
        );
      } else {
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);

export const loan_approval_rates = createAsyncThunk(
  "dashboard/loan_approval_rate",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");
      console.log("Token from cookies:", token);

      const response = await axios.get(
        `${BASE_URL}/api/partner/loan-approval-rate`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "Unauthorized");
      } else if (error.request) {
        return rejectWithValue(
          "No response from the server. Please check your network connection."
        );
      } else {
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);

export const _Loan_Disbursed = createAsyncThunk(
  "dashboard/_Loan_Disbursed",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");
      console.log("Token from cookies:", token);

      const response = await axios.get(
        `${BASE_URL}/api/partner/total-loan-disbursed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "Unauthorized");
      } else if (error.request) {
        return rejectWithValue(
          "No response from the server. Please check your network connection."
        );
      } else {
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);

export const _Loan_volume = createAsyncThunk(
  "dashboard/_Loan_volume",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");
      console.log("Token from cookies:", token);

      const response = await axios.get(
        `${BASE_URL}/api/partner/total-loan-volume`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "Unauthorized");
      } else if (error.request) {
        return rejectWithValue(
          "No response from the server. Please check your network connection."
        );
      } else {
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);

export const _pending_loans = createAsyncThunk(
  "dashboard/pending-loans",
  async (
    params: {
      search?: string;
      min_amount?: number | string;
      max_amount?: number | string;
      min_credit_score?: number | string;
      max_credit_score?: number | string;
      start_date?: string;
      end_date?: string;
      min_user_income?: number | string;
      max_user_income?: number | string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = Cookies.get("authToken");
      console.log("Token from cookies:", token);

      // Build query parameters object, excluding empty values
      const queryParams: Record<string, string> = {};

      if (params.search && params.search !== "")
        queryParams.search = params.search;
      if (params.min_amount && params.min_amount !== "")
        queryParams.min_amount = params.min_amount.toString();
      if (params.max_amount && params.max_amount !== "")
        queryParams.max_amount = params.max_amount.toString();
      if (params.min_credit_score && params.min_credit_score !== "")
        queryParams.min_credit_score = params.min_credit_score.toString();
      if (params.max_credit_score && params.max_credit_score !== "")
        queryParams.max_credit_score = params.max_credit_score.toString();
      if (params.start_date && params.start_date !== "")
        queryParams.start_date = params.start_date;
      if (params.end_date && params.end_date !== "")
        queryParams.end_date = params.end_date;
      if (params.min_user_income && params.min_user_income !== "")
        queryParams.min_user_income = params.min_user_income.toString();
      if (params.max_user_income && params.max_user_income !== "")
        queryParams.max_user_income = params.max_user_income.toString();

      const response = await axios.get(
        `${BASE_URL}/api/partner/pending-loans`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: queryParams,
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "Unauthorized");
      } else if (error.request) {
        return rejectWithValue(
          "No response from the server. Please check your network connection."
        );
      } else {
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);

export const _Default_Rate = createAsyncThunk(
  "dashboard/Default_Rate",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");
      console.log("Token from cookies:", token);

      const response = await axios.get(`${BASE_URL}/api/partner/default-rate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "Unauthorized");
      } else if (error.request) {
        return rejectWithValue(
          "No response from the server. Please check your network connection."
        );
      } else {
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);

export const total_revenue_perer_time = createAsyncThunk(
  "dashboard/total_revenue_perer_time",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");
      console.log("Token from cookies:", token);

      const response = await axios.get(
        `${BASE_URL}/api/partner/total-revenue-per-time`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "Unauthorized");
      } else if (error.request) {
        return rejectWithValue(
          "No response from the server. Please check your network connection."
        );
      } else {
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);

export const _loan_performance = createAsyncThunk(
  "dashboard/_loan_performance",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");
      console.log("Token from cookies:", token);

      const response = await axios.get(
        `${BASE_URL}/api/partner/loan-performance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          handleUnauthorizedError();
          return rejectWithValue("Unauthorized: Please log in again.");
        }
        return rejectWithValue(error.response.data.message || "Unauthorized");
      } else if (error.request) {
        return rejectWithValue(
          "No response from the server. Please check your network connection."
        );
      } else {
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);
