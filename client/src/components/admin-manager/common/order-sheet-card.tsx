import type { OrderSheetType } from "../../../common/types";
import { OrderSheetStatus } from "../../../common/values";
import { getElapsedTimeText, useElapsedTime } from "../../../hook/use-time";

const OrderSheetCard = ({
  orderSheet,
  onClick,
}: {
  orderSheet: OrderSheetType;
  onClick: () => void;
}) => {
  const isPending = orderSheet!.status! === OrderSheetStatus.pending;
  const isCancel = orderSheet!.status! === OrderSheetStatus.canceled;
  const isConfirm = orderSheet!.status! === OrderSheetStatus.confirm;
  const isService = orderSheet!.status! === OrderSheetStatus.serviced;
  const orderTime = orderSheet!.createAt as string;

  const elapsed = useElapsedTime(orderTime); // ✅ Hook luôn gọi

  const displayedElapsed =
    isPending || isConfirm
      ? elapsed.text
      : getElapsedTimeText(orderTime, orderSheet!.serviceAt as string).text;

  let colorClass = "";
  const seconds =
    isPending || isConfirm
      ? elapsed.seconds
      : getElapsedTimeText(orderTime, orderSheet!.serviceAt as string).seconds;
  if (seconds > 15 * 60 || isCancel) colorClass = "red";
  else if (seconds > 10 * 60) colorClass = "orange";
  else colorClass = "green";

  return (
    <div className={`order-sheet ${colorClass}`} onClick={onClick}>
      <h3>Phiếu #{orderSheet!.id}</h3>
      <div className="sub-info">
        <b>Bàn:</b> {orderSheet!.table!.name} - {orderSheet!.table!.floor!.name}
      </div>
      {/* <div className="sub-info"><b>Tầng:</b> {orderSheet!.table!.floor!.name}</div> */}
      <div className="sub-info">
        <b>Gọi lúc:</b> {orderTime}
      </div>
      <div className="sub-info">
        <b>
          {isPending || isConfirm ? "Đã chờ: " : isService ? "Phục vụ: " : ""}
        </b>{" "}
        {isPending || isConfirm
          ? displayedElapsed
          : isService
            ? orderSheet!.serviceAt!
            : ""}
      </div>
      <div className="sub-info">
        <b>Tổng số món:</b> {orderSheet!.orderSheetDetails!.length}
      </div>
      <div
        className="sub-info note line-clamp"
        style={{ "--line-clamp": 4 } as React.CSSProperties}
      >
        <b>Ghi chú:</b> {orderSheet!.note}
      </div>
      <div
        className={
          "status " +
          (orderSheet!.status === OrderSheetStatus.serviced
            ? "purple"
            : orderSheet!.status === OrderSheetStatus.confirm
              ? "green"
              : orderSheet!.status === OrderSheetStatus.canceled
                ? "red"
                : "")
        }
      >
        {orderSheet!.status}
      </div>
    </div>
  );
};

export default OrderSheetCard;
