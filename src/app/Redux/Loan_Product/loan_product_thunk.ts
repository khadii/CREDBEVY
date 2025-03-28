import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Define an interface for the credentials
interface LoanProductCredentials {
    product_name: any;
    loan_type: any;
    repayment_frequency: any;
    minimum_amount: any;
    maximum_amount: any;
    duration: any;
    interest_rate: any;
    discount_percentage: any;
    discount_duration: any;
    minimum_credit_score: any;
    maximum_credit_score: any;
    minimum_income: any;
    employment_status: any;
    category: any;
    collateral_uuids: any[];
}



export const _create_loan_product = createAsyncThunk(
    "dashboard/_create_loan_product",
    async (credentials: LoanProductCredentials, { rejectWithValue }) => {
        try {
            const token = Cookies.get("authToken");
            console.log("Token from cookies:", token);

            const response = await axios.post(
                "https://credbevy.jbenergyservices.com/public/api/partner/loan-products/add-loan-product",
                credentials, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || "Unauthorized");
            } else if (error.request) {
                return rejectWithValue("No response from the server. Please check your network connection.");
            } else {
                return rejectWithValue("An unexpected error occurred. Please try again.");
            }
        }
    }
);



interface FiltersProps {
  search?: string;
  sort_by?: string;
  start_date?: string;
  end_date?: string;
  single?: boolean;
  limit?: string;
  pagina?: any;
  page?: number;
}

export const _loan_products_all = createAsyncThunk(
  "loanProducts/_loan_products_all",
  async (filters: FiltersProps, { rejectWithValue }) => {
    const { page } = filters;
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `https://credbevy.jbenergyservices.com/public/api/partner/loan-products/all?page=${page}`,
        filters,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the entire API response
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || "Unauthorized");
      } else if (error.request) {
        return rejectWithValue("No response from the server. Please check your network connection.");
      } else {
        return rejectWithValue("An unexpected error occurred. Please try again.");
      }
    }
  }
);


interface Year {
    year?: string;
  }
export const _loan_products_stats = createAsyncThunk(
    "loanProducts/_loan_products_stats",
    async (Year: Year, { rejectWithValue }) => {
      const { year } = Year;
      try {
        const token = Cookies.get("authToken");
        const response = await axios.post(
          `https://credbevy.jbenergyservices.com/public/api/partner/loan-products/stats?page=${year}`,
          Year,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data; // Return the entire API response
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data.message || "Unauthorized");
        } else if (error.request) {
          return rejectWithValue("No response from the server. Please check your network connection.");
        } else {
          return rejectWithValue("An unexpected error occurred. Please try again.");
        }
      }
    }
  );
  
  interface Year2{
    year?: any;
    product_id: any;
  }
  

  
  export const _single_loan_products_stats = createAsyncThunk(
    "_single_loan_products_stats",
    async ({ year, product_id}: Year2, { rejectWithValue }: { rejectWithValue: Function }) => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          return rejectWithValue("Authentication token is missing.");
        }
  
        const response = await axios.post(
          `https://credbevy.jbenergyservices.com/public/api/partner/loan-products/stats-per-product/${product_id}?page=${year}`, // Assuming page = year
          { year }, // Send the year in the body (if needed)
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data; // Return the API response
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data.message || "Unauthorized");
        } else if (error.request) {
          return rejectWithValue("No response from the server. Please check your network connection.");
        } else {
          return rejectWithValue("An unexpected error occurred. Please try again.");
        }
      }
    }
  );

  interface Delete{
    loan_product_ids?: any;
    action: any;
  }
  

  
  export const bulk_action = createAsyncThunk(
    "bulk_action",
    async ({loan_product_ids,action}: Delete, { rejectWithValue }: { rejectWithValue: Function }) => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          return rejectWithValue("Authentication token is missing.");
        }
  
        const response = await axios.post(
         " https://credbevy.jbenergyservices.com/public/api/partner/loan-products/bulk-action",
          { loan_product_ids,action }, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data.message || "Unauthorized");
        } else if (error.request) {
          return rejectWithValue("No response from the server. Please check your network connection.");
        } else {
          return rejectWithValue("An unexpected error occurred. Please try again.");
        }
      }
    }
  );