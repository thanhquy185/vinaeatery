import type { EmployeeType, ScheduleType, ShiftType } from "../common/types";
import type { EmployeeConflictType } from "../components/admin-manager/modal/schedule/table-employees";

export const checkConflictSchedule = (
  employees: EmployeeType[],
  existingSchedules: ScheduleType[],
  selectedShifts: ShiftType[],
  dateStart?: string,
  dateEnd?: string,
) => {
  const isTimeOverlap = (
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ) => {
    return !(end1 <= start2 || start1 >= end2);
  };

  const isDateOverlap = (
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ) => {
    return !(end1 < start2 || start1 > end2);
  };

  const generateConflicts = () => {
    const result: EmployeeConflictType[] = [];

    for (const emp of employees) {
      const empSchedules = existingSchedules.filter((s) =>
        s.scheduleEmployees?.some((se) => se.employeeId === emp.id),
      );

      for (const schedule of empSchedules) {
        if (!dateStart || !dateEnd || !schedule.dateStart || !schedule.dateEnd)
          continue;

        // ✅ Check date overlap
        if (
          !isDateOverlap(
            dateStart,
            dateEnd,
            schedule.dateStart,
            schedule.dateEnd,
          )
        )
          continue;

        for (const newShift of selectedShifts) {
          if (!newShift.shiftDetails) continue;

          for (const ss of schedule.scheduleShifts || []) {
            if (!ss.shift?.shiftDetails) continue;

            for (const oldDetail of ss.shift.shiftDetails) {
              for (const newDetail of newShift.shiftDetails) {
                // ✅ Same day
                if (oldDetail.dayOfWeek !== newDetail.dayOfWeek) continue;

                // ✅ Time overlap
                if (
                  !isTimeOverlap(
                    oldDetail.timeStart!,
                    oldDetail.timeEnd!,
                    newDetail.timeStart!,
                    newDetail.timeEnd!,
                  )
                )
                  continue;

                const conflictData = {
                  scheduleName: schedule.name!,
                  scheduleDateStart: schedule.dateStart!,
                  scheduleDateEnd: schedule.dateEnd!,
                  shiftName: ss.shift.name!,
                  shiftDayOfWeek: oldDetail.dayOfWeek!,
                  shiftTimeStart: oldDetail.timeStart!,
                  shiftTimeEnd: oldDetail.timeEnd!,
                };

                let employeeConflict = result.find(
                  (r) => r.employeeId === emp.id,
                );

                if (!employeeConflict) {
                  employeeConflict = {
                    employeeId: emp.id!,
                    conflicts: [],
                  };
                  result.push(employeeConflict);
                }

                // ✅ tránh duplicate
                const isExist = employeeConflict.conflicts.some(
                  (c) =>
                    c.scheduleName === conflictData.scheduleName &&
                    c.scheduleDateStart === conflictData.scheduleDateStart &&
                    c.scheduleDateEnd === conflictData.scheduleDateEnd &&
                    c.shiftName === conflictData.shiftName &&
                    c.shiftDayOfWeek === conflictData.shiftDayOfWeek &&
                    c.shiftTimeStart === conflictData.shiftTimeStart &&
                    c.shiftTimeEnd === conflictData.shiftTimeEnd,
                );

                if (!isExist) {
                  employeeConflict.conflicts.push(conflictData);
                }
              }
            }
          }
        }
      }
    }

    return result;
  };

  return generateConflicts();
};
