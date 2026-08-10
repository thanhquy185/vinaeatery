import { OrderSheetStatusValue } from "../../constants/values";
import { getElapsedTimeText, useElapsedTime } from "../../hooks/useTime";
import type { OrderSheetSummaryResponseType } from "../../types/OrderSheetType";

type CardOrderSheetComponentProps = {
  orderSheet: OrderSheetSummaryResponseType;
  onClick: () => void;
};

const CardOrderSheetComponent: React.FC<CardOrderSheetComponentProps> = ({
  orderSheet,
  onClick,
}) => {
  const isPending = orderSheet.status === OrderSheetStatusValue.pending;
  const isCancelled = orderSheet.status === OrderSheetStatusValue.cancelled;
  const isConfirmed = orderSheet.status === OrderSheetStatusValue.confirmed;
  const isService = orderSheet.status === OrderSheetStatusValue.serviced;
  const orderTime = orderSheet.createAt as string;

  const elapsed = useElapsedTime(orderTime); // ✅ Hook luôn gọi

  const displayedElapsed =
    isPending || isConfirmed
      ? elapsed.text
      : getElapsedTimeText(orderTime, orderSheet.serviceAt as string).text;

  let colorClass = "";
  const seconds =
    isPending || isConfirmed
      ? elapsed.seconds
      : getElapsedTimeText(orderTime, orderSheet.serviceAt as string).seconds;
  if (seconds > 15 * 60 || isCancelled) colorClass = "red";
  else if (seconds > 10 * 60) colorClass = "orange";
  else colorClass = "green";

  return (
    <div className={`order-sheet ${colorClass}`} onClick={onClick}>
      <h3>Phiếu #{orderSheet.id}</h3>
      <div className="sub-info">
        <b>Bàn: </b>
        {orderSheet.useTable.table.name}
      </div>
      <div className="sub-info">
        <b>Tầng: </b>
        {orderSheet.useTable.table.floor.name}
      </div>
      <div className="sub-info">
        <b>Gọi lúc: </b>
        {orderTime}
      </div>
      {(isPending || isConfirmed) && (
        <div className="sub-info">
          <b>Đã chờ </b>
          {displayedElapsed}
        </div>
      )}
      {isService && (
        <div className="sub-info">
          <b>Phục vụ: </b>
          {orderSheet.serviceAt}
        </div>
      )}
      {isCancelled && (
        <div className="sub-info">
          <b>Huỷ bỏ: </b>
          {orderSheet.cancelAt}
        </div>
      )}
      {/* <div className="sub-info">
        <b>Tổng số món:</b> {orderSheet.orderSheetDetails!.length}
      </div> */}
      <div
        className="sub-info note line-clamp"
        style={{ "--line-clamp": 4 } as React.CSSProperties}
      >
        <b>Ghi chú: </b>
        {orderSheet.note}
      </div>
      <div
        className={
          "status " +
          (orderSheet.status === OrderSheetStatusValue.serviced
            ? "purple"
            : orderSheet.status === OrderSheetStatusValue.confirmed
              ? "green"
              : orderSheet.status === OrderSheetStatusValue.cancelled
                ? "red"
                : "")
        }
      >
        {orderSheet.status}
      </div>
    </div>
  );
};

export default CardOrderSheetComponent;
