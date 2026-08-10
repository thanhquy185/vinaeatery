import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import OrderSheetApiService from "../../../../services/api/v1/OrderSheetApiService";
import SockJS from "sockjs-client";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Spin } from "antd";
import { OrderSheetStatusValue } from "../../../../constants/values";
import { getElapsedTimeText, useElapsedTime } from "../../../../hooks/useTime";
import { actionIndexes } from "../../../../utils/defaultActions";
import { openConfirmation } from "../../../../utils/showConfirmation";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import { hasPermission } from "../../../../utils/hasPermissions";
import { over } from "stompjs";
import type { Client } from "stompjs";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { OrderSheetStatusEnum } from "../../../../constants/enums";
import type {
  OrderSheetDetailResponseType,
  OrderSheetUpdateStatusRequestType,
} from "../../../../types/OrderSheetType";
import type { UpdateStatusOrderSheetRequestType } from "../../../../types/SocketType";

const UpdateOrderSheetModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  isManager,
  restaurantId,
  validActions,
  data,
  dataForCrud,
  closeModal,
}) => {
  const { data: orderSheetDetail, isLoading } =
    useEntityQuery<OrderSheetDetailResponseType>({
      keys: ["order-sheet", data.id],
      params: { id: data.id },
      api: OrderSheetApiService.handleGetDetailById,
    });

  //
  const isPending = orderSheetDetail?.status === OrderSheetStatusValue.pending;
  const isCancelled =
    orderSheetDetail?.status === OrderSheetStatusValue.cancelled;
  const isConfirmed =
    orderSheetDetail?.status === OrderSheetStatusValue.confirmed;
  const isServiced =
    orderSheetDetail?.status === OrderSheetStatusValue.serviced;
  const orderTime = orderSheetDetail?.createAt!;

  // Nếu đang pending thì đếm tự động mỗi giây
  const liveElapsed = useElapsedTime(orderTime);
  const elapsed =
    isPending || isConfirmed
      ? liveElapsed
      : getElapsedTimeText(orderTime, orderSheetDetail?.serviceAt as string);

  //
  const stompClientMessageRef = useRef<Client | null>(null);

  // Lời nhắn cho phiếu gọi món
  const [messageValue, setMessageValue] = useState<string>(
    orderSheetDetail?.message!,
  );

  // Update Mutation
  const updateMutation = useEntityMutation<
    OrderSheetUpdateStatusRequestType,
    OrderSheetDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["order-sheet", data.id]],
    api: OrderSheetApiService.handleUpdateStatus,
  });

  // Hàm gọi API để cập nhật trạng thái phiếu gọi món
  const callApiToUpdateOrderSheet = async (
    id: number,
    button: HTMLElement,
    value: string,
  ) => {
    button.classList.add("active");

    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      const response = await updateMutation.mutateAsync({
        values: {
          id: id,
          serviceAt:
            value === OrderSheetStatusValue.serviced
              ? dayjs().format("YYYY-MM-DD HH:mm:ss")
              : undefined,
          cancelAt:
            value === OrderSheetStatusValue.cancelled
              ? dayjs().format("YYYY-MM-DD HH:mm:ss")
              : undefined,
          employeeId: dataForCrud?.infoLogin?.id,
          message: messageValue,
          status: value as OrderSheetStatusEnum,
        },
      });
      if (response) {
        const socket = new SockJS("http://localhost:8080/websocket");
        const client = over(socket);
        stompClientMessageRef.current = client;

        client.connect({}, () => {
          client.send(
            "/app/update-status-order-sheet",
            {},
            JSON.stringify({
              orderSheetId: orderSheetDetail?.id,
            } as UpdateStatusOrderSheetRequestType),
          );
        });

        closeModal();
      }
    }

    button.classList.remove("active");
  };

  return (
    <Spin spinning={!orderSheetDetail || isLoading}>
      {orderSheetDetail && (
        <>
          <div className="info">
            <b>Mã phiếu:</b>#{orderSheetDetail.id}
          </div>
          <div className="info">
            <b>Bàn ăn:</b>
            {orderSheetDetail.useTable.table.name}
          </div>
          <div className="info">
            <b>Tầng:</b>
            {orderSheetDetail.useTable.table.floor.name}
          </div>
          <div className="info">
            <b>Thời gian gọi món:</b>
            {orderSheetDetail.createAt}
          </div>
          {(isPending || isConfirmed) && (
            <div className="info">
              <b>Thời gian đã chờ:</b>
              {elapsed.text}
            </div>
          )}
          {isServiced && (
            <div className="info">
              <b>Thời gian phục vụ:</b>
              {orderSheetDetail.serviceAt}
            </div>
          )}
          {isCancelled && (
            <div className="info">
              <b>Thời gian huỷ bỏ:</b>
              {orderSheetDetail.cancelAt}
            </div>
          )}
          {(isServiced || isConfirmed || isCancelled) && (
            <div className="info">
              <b>Nhân viên xác nhận:</b>
              {orderSheetDetail.employee?.fullname}
            </div>
          )}
          <div className="info">
            <b>Tổng tiền món ăn:</b>
            {vietnamMoneyFormat(orderSheetDetail.totalPrice)}
          </div>
          <div className="info">
            <b>Trạng thái:</b>
            <span
              className={
                "status " +
                (orderSheetDetail.status === OrderSheetStatusValue.serviced
                  ? "purple"
                  : orderSheetDetail.status === OrderSheetStatusValue.confirmed
                    ? "green"
                    : orderSheetDetail.status ===
                        OrderSheetStatusValue.cancelled
                      ? "red"
                      : "gray")
              }
            >
              {orderSheetDetail.status}
            </span>
          </div>
          <div className="info">
            <b>Chi tiết gọi món:</b>
            <table>
              <colgroup>
                <col width="10%" />
                <col width="28%" />
                <col width="10%" />
                <col width="16%" />
                <col width="16%" />
                <col width="20%" />
              </colgroup>
              <thead>
                <tr>
                  <th>Mã món ăn</th>
                  <th>Tên món ăn</th>
                  <th>Đơn vị</th>
                  <th>Giá bán</th>
                  <th>Yêu cầu</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderSheetDetail.orderSheetDetails.map((orderSheetDetail) => (
                  <>
                    <tr>
                      <td>{orderSheetDetail.food.id}</td>
                      <td>{orderSheetDetail.foodNameSnapshot}</td>
                      <td>{orderSheetDetail.food.unit}</td>
                      <td>
                        {vietnamMoneyFormat(orderSheetDetail.foodPriceSnapshot)}
                      </td>
                      <td>{orderSheetDetail.quantity}</td>
                      <td>
                        {vietnamMoneyFormat(orderSheetDetail.totalPriceDetail)}
                      </td>
                    </tr>
                    <tr className="sub-row">
                      <td colSpan={6}>
                        <table className="sub-table">
                          <colgroup>
                            <col width="28%" />
                            <col width="20%" />
                            <col width="20%" />
                            <col width="16%" />
                            <col width="16%" />
                          </colgroup>
                          <tbody>
                            {orderSheetDetail.food.recipes.map((recipe) => (
                              <tr key={recipe.ingredient.id}>
                                <td className="left">
                                  {recipe.ingredient.name}
                                </td>
                                <td>
                                  {recipe.ingredient.categoryIngredient.name}
                                </td>
                                <td>
                                  {recipe.ingredient.capacity}&nbsp;
                                  {recipe.ingredient.unit}
                                </td>
                                <td>
                                  {orderSheetDetail.quantity}&nbsp;x&nbsp;
                                  {recipe.quantity}
                                </td>
                                <td>{recipe.ingredient.inventory}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <div className="info">
            <b>Lời nhắn:</b>
            <TextArea
              placeholder="Nhập Lời nhắn"
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              disabled={isCancelled || isServiced}
            />
          </div>
          <div className="note">
            Ghi chú: {orderSheetDetail.note! ? orderSheetDetail.note : "Không"}
          </div>
          {hasPermission({
            isManager: isManager!,
            restaurantIdForCrud: restaurantId,
            validActions,
            requiredActionId: actionIndexes.update,
          }) && (
            <div className="modal__buttons mg-top">
              {orderSheetDetail.status === OrderSheetStatusValue.confirmed && (
                <button
                  className="modal__button secondary btn purple-secondary"
                  onClick={(e) =>
                    callApiToUpdateOrderSheet(
                      orderSheetDetail.id,
                      e.target as HTMLElement,
                      OrderSheetStatusValue.serviced,
                    )
                  }
                >
                  {OrderSheetStatusValue.serviced}
                </button>
              )}
              {orderSheetDetail.status === OrderSheetStatusValue.pending && (
                <>
                  <button
                    className="modal__button secondary btn green-secondary"
                    onClick={(e) =>
                      callApiToUpdateOrderSheet(
                        orderSheetDetail.id,
                        e.target as HTMLElement,
                        OrderSheetStatusValue.confirmed,
                      )
                    }
                  >
                    {OrderSheetStatusValue.confirmed}
                  </button>
                  <button
                    className="modal__button secondary btn red-secondary"
                    onClick={(e) =>
                      callApiToUpdateOrderSheet(
                        orderSheetDetail.id,
                        e.target as HTMLElement,
                        OrderSheetStatusValue.cancelled,
                      )
                    }
                  >
                    {OrderSheetStatusValue.cancelled}
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </Spin>
  );
};

export default UpdateOrderSheetModalComponent;
