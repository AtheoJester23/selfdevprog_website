import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseServerActionResponse<T>(response: T){
  return JSON.parse(JSON.stringify(response));
}

// Convert "HH:MM" to total minutes:
export function toMinutes(timeStr: string) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
}

export function toTimeString(totalMinutes: number) {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

//Convert Military time to standard time:
export function to12Hour (timeStr: string){
    const date = parse(timeStr, 'HH:mm', new Date());
    return format(date, 'hh:mm a'); // '12:00 AM', '01:45 PM', etc.
};

//Get difference between starting time and end time
export function getTimeDifferenceInDayCycle(start: string, end: string): number {
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);

    if (endMin >= startMin) {
        return endMin - startMin;
    } else {
        // Wrap around midnight
        return (1440 - startMin) + endMin;
    }
}