export const constants = {
  status: {
    succeeded: "succeeded",
    cancelled: "cancelled",
    expired: "expired",
    pending: "pending",
    paymentExpired: "paymentExpired",
  },
  time: {
    DAY: 24 * 60 * 60 * 1000,
    MINUTE: 60 * 1000,
  },
  plan: {
    min: 1,
    max: 3,
  },
};

export const constantsFindId = {
  subscriptionId: "subscriptionId",
  subscriptionIdMessage: "subscriptionId is not valid MongoId",
};

export const constantsNewSub = {
  plan: "plan",
  planMessage: "Valid plans are 1, 2, 3",
  price: "price",
  priceMessage: "Price must be a number",
};

export const constantsUpdateSub = {
  plan: "plan",
  planMessage: "Valid plans are 1, 2, 3",
  price: "price",
  priceMessage: "Price must be a number",
  receiptEmail: "receipt_email",
  receiptEmailMessage: "Invalid email",
};

export function calculatePrice(plan) {
  switch (plan) {
    case 1:
      return 12;
    case 2:
      return 55;
    case 3:
      return 100;
    default:
      throw new Error("Invalid plan. Valid plans are 1, 2, or 3");
  }
}