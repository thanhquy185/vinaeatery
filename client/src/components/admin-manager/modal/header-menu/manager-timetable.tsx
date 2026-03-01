import { type FC } from "react";
import type { CrudObjectModalProps } from "../../../../common/props";
import CustomTimetable from "../../common/timetable";
import { CommonStatus } from "../../../../common/values";
import { useEntityQuery } from "../../../../hook/use-entity-query";
import { FindAllSchedule } from "../../../../requests/schedule";
import type { ScheduleType } from "../../../../common/types";

// Manager Timetable
const ManagerTimetable: FC<CrudObjectModalProps> = ({
  objectEN,
  data,
  closeModal,
}) => {
  const { data: schedules } = useEntityQuery<ScheduleType[]>({
    keys: [objectEN, data.restaurantId, CommonStatus.active],
    params: {
      restaurantId: data.restaurantId,
      findType: "employeeId",
      findValue: data.id,
      statusValue: [CommonStatus.active],
    },
    api: FindAllSchedule,
  });

  return (
    <CustomTimetable
      isShowHeader={true}
      isSchedule={true}
      schedules={schedules}
    />
  );
};

export default ManagerTimetable;
