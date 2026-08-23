export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Zagreb"
  });
};

export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Zagreb"
  });
};