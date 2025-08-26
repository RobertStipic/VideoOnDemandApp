import { constants } from "../constants/general.js";
export const calculateExpiration = (plan, date) => {
  try{
  if (!date) {
    let now = Date.now();
    switch (plan) {
      case 1:
        return new Date(now + 30 * constants.time.DAY);
      case 2:
        return new Date(now + 180 * constants.time.DAY);
      case 3:
        return new Date(now + 365 * constants.time.DAY);
      default:
        throw new Error("Invalid subscription plan");
    }
  }

  if (plan && date) {
    switch (plan) {
      case 1:
        return new Date(date + 30 * constants.time.DAY);
      case 2:
        return new Date(date + 180 * constants.time.DAY);
      case 3:
        return new Date(date + 365 * constants.time.DAY);
      default:
        throw new Error("Invalid subscription plan");
    }
  }
} catch(error) {
    console.error("Error calculating subscription expiration", error);
  }
};
export const calculatePaymentExpiration = () => {
  try{
  let now = Date.now();
  return new Date(now + 10 * constants.time.MINUTE);
  }catch(error) {
    console.error("Error calculating payment expiration", error);
  }
};
