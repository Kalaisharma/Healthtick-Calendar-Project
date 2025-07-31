import { format, addMinutes, setHours, setMinutes } from "date-fns";

export const generateTimeSlots = () => {
  const slots: string[] = [];
  let current = setMinutes(setHours(new Date(), 10), 30); // 10:30 AM
  const end = setMinutes(setHours(new Date(), 19), 30); // 7:30 PM

  while (current <= end) {
    slots.push(format(current, "hh:mm a"));
    current = addMinutes(current, 20);
  }

  return slots;
};
