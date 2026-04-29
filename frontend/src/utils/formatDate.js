/*
  Format date string into a readable date.

  Example:
  "2026-04-28T00:00:00.000Z" -> "04/28/2026"
*/
export const formatDate = (dateValue) => {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/*
  Format date and time.

  Example:
  "2026-04-28T10:30:00.000Z" -> "04/28/2026, 10:30 AM"
*/
export const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};