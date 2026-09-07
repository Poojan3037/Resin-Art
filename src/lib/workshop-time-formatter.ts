export const formatWorkshopTime = (workshop: {
  startTime: string;
  startPeriod: string;
  endTime: string;
  endPeriod: string;
}) => {
  return `${workshop.startTime} ${workshop.startPeriod} – ${workshop.endTime} ${workshop.endPeriod}`;
};

export const formatWorkshopDate = (date: string | Date) => {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};
