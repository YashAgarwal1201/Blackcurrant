export const formatDate = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const dayName = date.toLocaleString("en-us", { weekday: "short" }); // Short day name
  const monthName = date.toLocaleString("en-us", { month: "short" }); // Short month name
  const day = date.getDate();

  return `${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${dayName}, ${monthName} ${day}`;
};

export const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};
