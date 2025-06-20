import { useCallback } from "react";

 export const formatCurrency =(value: any) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace("NGN", "₦");
  };