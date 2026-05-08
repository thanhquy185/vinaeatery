import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { OrderSheetType } from "../../../../common/types";
import { OrderSheetStatus } from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { getElapsedTimeText, useElapsedTime } from "../../../../hook/use-time";
import { HandleUpdateOrderSheet } from "../../../../requests/order-sheets";
import { actionIndexes } from "../../../../utils/default-actions";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { vietnamMoneyFormat } from "../../../../utils/other-events";
import { hasPermission } from "../../../../utils/has-permissions";

// Manager Update Order Table
const ManagerUpdateOrderSheet: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  isManager,
  restaurantId,
  validActions,
  data,
  dataForCrud,
  closeModal,
}) => {
  //
  const isPending = data?.status! === OrderSheetStatus.pending;
  const isCancel = data?.status! === OrderSheetStatus.canceled;
  const isConfirm = data?.status! === OrderSheetStatus.confirm;
  const isService = data?.status! === OrderSheetStatus.serviced;
  const orderTime = data?.createAt!;

  // Nếu đang pending thì đếm tự động mỗi giây
  const elapsed =
    isPending || isConfirm
      ? useElapsedTime(orderTime)
      : getElapsedTimeText(orderTime, data?.serviceAt! as string);

  // Lời nhắn cho phiếu gọi món
  const [messageValue, setMessageValue] = useState<string>(data?.message!);

  // Update Mutation
  const updateMutation = useEntityMutation<OrderSheetType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateOrderSheet,
  });

  // Hàm gọi API để cập nhật trạng thái phiếu gọi món
  const callApiToUpdateOrderSheet = async (
    id: number,
    button: HTMLElement,
    value: string,
  ) => {
    // Thêm class 'active' thể hiện là nút được nhấn
    button.classList.add("active");

    // Hỏi trước khi xử khi xử lý ?
    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      // Biến giữ giá trị tương ứng với "trạng thái" cần thay đổi
      let status = null;
      if (
        value === OrderSheetStatus.serviced ||
        value === OrderSheetStatus.confirm ||
        value === OrderSheetStatus.canceled
      ) {
        status = value;
      }

      // Thực thi mutation
      const response = await updateMutation.mutateAsync({
        values: {
          restaurantId: restaurantId,
          id: id,
          serviceAt:
            value === OrderSheetStatus.serviced
              ? new Date().toISOString()
              : undefined,
          employeeId: dataForCrud?.infoLogin?.id,
          message: messageValue! || undefined,
          status: status! || undefined,
        },
      });
      if (response) {
        closeModal();
      }
    } else {
      // Xoá class 'active' thể hiện là nút không còn được nhấn
      button.classList.remove("active");
    }
  };

  return (
    <>
      <div className="info">
        <b>Mã phiếu:</b>#{data?.id!}
      </div>
      <div className="info">
        <b>Bàn ăn:</b>
        {data?.table!.name} - {data?.table!.floor?.name}
      </div>
      <div className="info">
        <b>Thời gian gọi món:</b>
        {data?.createAt!}
      </div>
      {(isPending || isConfirm) && (
        <div className="info">
          <b>Thời gian đã chờ:</b>
          {elapsed.text}
        </div>
      )}
      {isService && (
        <div className="info">
          <b>Thời gian phục vụ:</b>
          {data?.serviceAt!}
        </div>
      )}
      {(isService || isConfirm || isCancel) && (
        <div className="info">
          <b>Nhân viên xác nhận:</b>
          {data?.employee?.fullname} - {data?.employee?.phone} -{" "}
          {data?.employee?.email}
        </div>
      )}
      <div className="info">
        <b>Tổng tiền món ăn:</b>
        {vietnamMoneyFormat(data?.totalPrice!)}
      </div>
      <div className="info">
        <b>Trạng thái:</b>
        <span
          className={
            "status " +
            (data?.status! === OrderSheetStatus.serviced
              ? "purple"
              : data?.status! === OrderSheetStatus.confirm
                ? "green"
                : data?.status! === OrderSheetStatus.canceled
                  ? "red"
                  : "gray")
          }
        >
          {data?.status!}
        </span>
      </div>
      <div className="info">
        <b>Chi tiết gọi món:</b>
        <table>
          <colgroup>
            <col width="12%" />
            <col width="36%" />
            <col width="12%" />
            <col width="20%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th>Mã món ăn</th>
              <th>Tên món ăn</th>
              <th>Đơn vị</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {(data as OrderSheetType)?.orderSheetDetails?.map(
              (orderSheetDetail) => (
                <tr>
                  <td>{orderSheetDetail?.food?.id}</td>
                  <td className="left">{orderSheetDetail?.food?.name}</td>
                  <td>{orderSheetDetail?.food?.unit}</td>
                  <td>{vietnamMoneyFormat(orderSheetDetail?.price!)}</td>
                  <td>{orderSheetDetail?.quantity}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <div className="info">
        <b>Lời nhắn:</b>
        <TextArea
          placeholder="Nhập Lời nhắn"
          value={messageValue!}
          onChange={(e) => setMessageValue(e.target.value)}
          disabled={isCancel || isService}
        />
      </div>
      <div className="note">Ghi chú: {data?.note! ? data?.note : "Không"}</div>
      {hasPermission({
        isManager: isManager!,
        restaurantIdForCrud: restaurantId,
        validActions,
        requiredActionId: actionIndexes.update,
      }) && (
        <div className="modal__buttons mg-top">
          {data?.status! === OrderSheetStatus.confirm && (
            <button
              className="modal__button secondary btn purple-secondary"
              onClick={(e) =>
                callApiToUpdateOrderSheet(
                  data?.id!,
                  e.target as HTMLElement,
                  OrderSheetStatus.serviced,
                  // messageValue
                )
              }
            >
              {OrderSheetStatus.serviced}
            </button>
          )}
          {data?.status! === OrderSheetStatus.pending && (
            <>
              <button
                className="modal__button secondary btn green-secondary"
                onClick={(e) =>
                  callApiToUpdateOrderSheet(
                    data?.id!,
                    e.target as HTMLElement,
                    OrderSheetStatus.confirm,
                    // messageValue
                  )
                }
              >
                {OrderSheetStatus.confirm}
              </button>
              <button
                className="modal__button secondary btn red-secondary"
                onClick={(e) =>
                  callApiToUpdateOrderSheet(
                    data?.id!,
                    e.target as HTMLElement,
                    OrderSheetStatus.canceled,
                    // messageValue
                  )
                }
              >
                {OrderSheetStatus.canceled}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ManagerUpdateOrderSheet;
