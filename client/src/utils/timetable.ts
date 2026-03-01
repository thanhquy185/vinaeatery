//
interface ShiftPayload {
  dayOfWeek: number;
  timeStart: string;
  timeEnd: string;
}

//
export const getTotalWeeksInMonth = (year: number, month: number) => {
  const totalDays = new Date(year, month + 1, 0).getDate();
  return Math.ceil(totalDays / 7);
}

//
export const getDayOfWeekLabel = (value: number) => {
  if(value === 1) return "Thứ 2";
  else if(value === 2) return "Thứ 3";
  else if(value === 3) return "Thứ 4";
  else if(value === 4) return "Thứ 5";
  else if(value === 5) return "Thứ 6";
  else if(value === 6) return "Thứ 7";
  else if(value === 7) return "Chủ nhật";
}

//
export const cellsToShifts = (cells: Set<string>): ShiftPayload[] => {
  const map = new Map<number, number[]>();

  // gom theo ngày
  cells.forEach((key) => {
    const [day, hour] = key.split("-").map(Number);
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(hour);
  });

  const result: ShiftPayload[] = [];

  map.forEach((hours, day) => {
    hours.sort((a, b) => a - b);

    let start = hours[0];

    for (let i = 1; i <= hours.length; i++) {
      if (hours[i] !== hours[i - 1] + 1) {
        result.push({
          dayOfWeek: day,
          timeStart: `${String(start).padStart(2, "0")}:00`,
          timeEnd: `${String(hours[i - 1] + 1).padStart(2, "0")}:00`,
        });
        start = hours[i];
      }
    }
  });

  return result;
};

//
export const shiftsToCells = (shifts: ShiftPayload[]): Set<string> => {
  const cells = new Set<string>();

  shifts.forEach((shift) => {
    const day = Number(shift?.dayOfWeek);

    const startHour = Number(shift?.timeStart.split(":")[0]);
    const endHour = Number(shift?.timeEnd.split(":")[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      cells.add(`${day}-${hour}`);
    }
  });

  return cells;
};
