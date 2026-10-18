import { Tag } from "antd";
import { ReservationStatusValue } from "../../constants/values";
import type { ReservationStatusEnum } from "../../constants/enums";

type ReservationStatusTagComponentProps = {
  status: ReservationStatusEnum;
};

const ReservationStatusTagComponent: React.FC<
  ReservationStatusTagComponentProps
> = ({ status }) => {
  let statusClass = "reservation-status-tag--pending";
  let label = ReservationStatusValue.pending;
  if (status === ReservationStatusValue.confirmed) {
    statusClass = "reservation-status-tag--confirmed";
    label = ReservationStatusValue.confirmed;
  } else if (status === ReservationStatusValue.cancelled) {
    statusClass = "reservation-status-tag--cancelled";
    label = ReservationStatusValue.cancelled;
  }

  return (
    <Tag
      bordered={false}
      className={`reservation-status-tag ${statusClass}`}
    >
      {label}
    </Tag>
  );
};

export default ReservationStatusTagComponent;
