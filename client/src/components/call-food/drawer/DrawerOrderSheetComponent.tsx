import useEntityMutation from "../../../hooks/useEntityMutation";
import OrderSheetApiService from "../../../services/api/v1/OrderSheetApiService";
import dayjs from "dayjs";
import { CloseOutlined } from "@ant-design/icons";
import { OrderSheetStatusValue } from "../../../constants/values";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import { openConfirmation } from "../../../utils/showConfirmation";
import type { CallFoodPageProps } from "../../../constants/props";
import type { OrderSheetStatusEnum } from "../../../constants/enums";
import type {
  OrderSheetDetailResponseType,
  OrderSheetUpdateStatusRequestType,
} from "../../../types/OrderSheetType";

const DrawerOrderSheetComponent: React.FC<CallFoodPageProps> = ({
  stomp,
  queryKey,
  currentUseTable,
}) => {
  const updateStatusMutation = useEntityMutation<
    OrderSheetUpdateStatusRequestType,
    OrderSheetDetailResponseType
  >({
    messages: {
      success: `Huỷ gọi món ăn thành công!`,
      error: `Huỷ gọi món ăn thất bại!`,
    },
    invalidateKeys: [queryKey!],
    api: OrderSheetApiService.handleUpdateStatus,
  });

  // useEffect(() => {
  //   const client = stomp?.current;
  //   if (!client || !client.connected) {
  //     console.warn("WebSocket chưa kết nối");
  //     return;
  //   }

  //   client.connect({}, () => {
  //     console.log("WebSocket connected");

  //     client.subscribe(
  //       `/topic/call-food-order-sheets-use-table-${currentUseTable.id}`,
  //       () => {
  //         openNotification({
  //           type: "success",
  //           message: "Cập nhật trạng thái phiếu gọi món",
  //           description: "Nhà hàng đã trả lời tin nhắn của bạn!",
  //         });

  //         queryClient?.invalidateQueries({
  //           queryKey: queryKey,
  //         });
  //       },
  //     );
  //   });

  //   return () => {
  //     if (client.connected) {
  //       client.disconnect(() => console.log("WebSocket disconnected"));
  //     }
  //   };
  // }, []);

  return (
    <div className="call-food__order-sheets">
      {(currentUseTable.orderSheets ?? [])
        .sort((a, b) => b.createAt.localeCompare(a.createAt))
        .map((orderSheet) => (
          <>
            <div key={orderSheet.id} className="call-food__order-sheet">
              <p className="call-food__order-sheet-time">
                {orderSheet.createAt}
              </p>
              <div
                className={
                  "call-food__order-sheet-info " +
                  (orderSheet.status == OrderSheetStatusValue.serviced
                    ? "purple"
                    : orderSheet.status == OrderSheetStatusValue.confirmed
                      ? "green"
                      : orderSheet.status == OrderSheetStatusValue.cancelled
                        ? "red"
                        : "gray")
                }
              >
                <div className="call-food__order-sheet-header">
                  <b className="call-food__order-sheet-title">
                    Phiếu: #{orderSheet.id}
                  </b>
                  {orderSheet.status === OrderSheetStatusValue.pending && (
                    <button
                      className="btn red-secondary call-food__order-sheet-button"
                      onClick={async (e) => {
                        const button = e.currentTarget;
                        button.classList.add("active");

                        const answer = await openConfirmation({
                          title: "Bạn có chắc chắn huỷ gọi món ?",
                          content: "Hành động này không thể hoàn tác.",
                        });
                        if (answer) {
                          const response =
                            await updateStatusMutation.mutateAsync({
                              values: {
                                id: orderSheet.id,
                                employeeId: undefined,
                                serviceAt: undefined,
                                cancelAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                                message: undefined,
                                status:
                                  OrderSheetStatusValue.cancelled as OrderSheetStatusEnum,
                              },
                            });
                          if (response) {
                            const client = stomp?.current;
                            if (!client || !client.connected) {
                              console.warn("WebSocket chưa kết nối");
                              return;
                            }

                            client.send(
                              "/app/customer-cancel-order-sheet",
                              {},
                              currentUseTable.table.name,
                            );
                          }
                        }

                        button.classList.remove("active");
                      }}
                    >
                      <CloseOutlined />
                    </button>
                  )}
                </div>
                <table className="call-food__order-sheet-details">
                  <colgroup>
                    <col width="55%" />
                    <col width="15%" />
                    <col width="30%" />
                  </colgroup>
                  {(orderSheet.orderSheetDetails ?? []).map(
                    (orderSheetDetail, index) => (
                      <tr key={index}>
                        <td className="left">{orderSheetDetail.food.name}</td>
                        <td>{orderSheetDetail.quantity}x</td>
                        <td className="right">
                          {vietnamMoneyFormat(orderSheetDetail.price!)}
                        </td>
                      </tr>
                    ),
                  )}
                </table>
                <p className="call-food__order-sheet-total">
                  Tổng cộng: {vietnamMoneyFormat(orderSheet.totalPrice!)}
                </p>
                <p
                  className={
                    "call-food__order-sheet-status " +
                    (orderSheet.status == OrderSheetStatusValue.serviced
                      ? "purple"
                      : orderSheet.status == OrderSheetStatusValue.confirmed
                        ? "green"
                        : orderSheet.status == OrderSheetStatusValue.cancelled
                          ? "red"
                          : "gray")
                  }
                >
                  {orderSheet.status}
                </p>
                <p className="call-food__order-sheet-message">
                  Lời nhắn: {orderSheet.message}
                </p>
              </div>
            </div>
          </>
        ))}
    </div>
  );
};

export default DrawerOrderSheetComponent;
