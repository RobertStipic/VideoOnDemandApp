import { constants } from "../constants/general.js";
export const calculateExpiration = (plan, date) => {
  if (!date) {
    let now = Date.now();
    switch (plan) {
      case 1:
        return new Date(now + 30 * DAY);
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
};
export const calculatePaymentExpiration = () => {
  let now = Date.now();
  return new Date(now + 10 * constants.time.MINUTE);
};
