const DAY = 24 * 60 * 60 * 1000;

export const calculateExpiration = (plan, date) => {
  if (!date) {
    let now = Date.now();
    switch (plan) {
      case 1:
        return new Date(now + 30 * DAY);
      case 2:
        return new Date(now + 180 * DAY);
      case 3:
        return new Date(now + 365 * DAY);
      default:
        throw new Error("Invalid subscription plan");
    }
  }

  if (plan && date) {
    switch (plan) {
      case 1:
        return new Date(date + 30 * DAY);
      case 2:
        return new Date(date + 180 * DAY);
      case 3:
        return new Date(date + 365 * DAY);
      default:
        throw new Error("Invalid subscription plan");
    }
  }
};
