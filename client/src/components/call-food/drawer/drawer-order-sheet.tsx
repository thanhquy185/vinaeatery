import { useEffect, type FC } from "react";
import { OrderSheetStatus } from "../../../common/values";
import type { CallFoodLayoutProps } from "../../../layouts/call-food-layout";
import { openNotification } from "../../../utils/show-notification";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { vietnamMoneyFormat } from "../../../utils/other-events";

// Drawer Order Sheet
const DrawerOrderSheet: FC<CallFoodLayoutProps> = ({
  queryClient,
  currentUseTable,
}) => {
  useEffect(() => {
    //
    const socket = new SockJS("http://localhost:8080/websocket");
    const client = over(socket);

    client.connect({}, () => {
      console.log("WebSocket connected");
      client.subscribe(
        `/topic/call-food-order-sheets-use-table-${currentUseTable?.id}`,
        (message) => {
          if (message) {
            console.log(message);
            openNotification({
              type: "success",
              message: "Nhà hàng trả i",
              description: "Nhà hàng đã trả lời tin nhắn của bạn!",
            });
          }

          queryClient?.invalidateQueries({
            queryKey: ["current-use-table"],
          });
        },
      );
    });

    return () => {
      if (client.connected) {
        client.disconnect(() => console.log("WebSocket disconnected"));
      }
    };
  }, []);

  return (
    <div className="call-food__order-sheets">
      {currentUseTable?.orderSheets
        ?.sort(
          (a, b) =>
            new Date(b.createAt!).getTime() - new Date(a.createAt!).getTime(),
        )
        ?.map((orderSheet) => (
          <>
            <div key={orderSheet!.id} className="call-food__order-sheet">
              <p className="call-food__order-sheet-time">
                {orderSheet!.createAt!}
              </p>
              <div
                className={
                  "call-food__order-sheet-info " +
                  (orderSheet!.status! == OrderSheetStatus.serviced
                    ? "purple"
                    : orderSheet!.status! == OrderSheetStatus.confirm
                      ? "green"
                      : orderSheet!.status! == OrderSheetStatus.canceled
                        ? "red"
                        : "gray")
                }
              >
                <div className="call-food__order-sheet-header">
                  <b className="call-food__order-sheet-title">
                    Phiếu: #{orderSheet!.id!}
                  </b>
                  {/* {orderSheet?.status === OrderSheetStatus.pending && (
                    <button
                      className="btn red-secondary call-food__order-sheet-button"
                      onClick={() => {
                        console.log(123);
                      }}
                    >
                      Huỷ gọi món
                    </button>
                  )} */}
                </div>
                <table className="call-food__order-sheet-details">
                  <colgroup>
                    <col width="55%" />
                    <col width="15%" />
                    <col width="30%" />
                  </colgroup>
                  {orderSheet!.orderSheetDetails?.map(
                    (orderSheetDetail, index) => (
                      <tr key={index}>
                        <td className="left">
                          {orderSheetDetail?.food?.name!}
                        </td>
                        <td>{orderSheetDetail?.quantity!}x</td>
                        <td className="right">
                          {vietnamMoneyFormat(orderSheetDetail?.price!)}
                        </td>
                      </tr>
                    ),
                  )}
                </table>
                <p className="call-food__order-sheet-total">
                  Tổng cộng: {vietnamMoneyFormat(orderSheet!.totalPrice!)}
                </p>
                <p
                  className={
                    "call-food__order-sheet-status " +
                    (orderSheet!.status! == OrderSheetStatus.serviced
                      ? "purple"
                      : orderSheet!.status! == OrderSheetStatus.confirm
                        ? "green"
                        : orderSheet!.status! == OrderSheetStatus.canceled
                          ? "red"
                          : "gray")
                  }
                >
                  {orderSheet!.status!}
                </p>
                <p className="call-food__order-sheet-message">
                  Lời nhắn: {orderSheet!.message!}
                </p>
              </div>
            </div>
          </>
        ))}
    </div>
  );
};

export default DrawerOrderSheet;
