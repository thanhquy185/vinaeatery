import type { CrudObjectModalProps } from "../../../../common/props";
import { UseTableStatus } from "../../../../common/values";
import { actionIndexes } from "../../../../utils/default-actions";
import { hasPermission } from "../../../../utils/has-permissions";

// Manager Reserved Order Table
const ManagerReservedUseTable: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  isManager,
  restaurantId,
  validActions,
  data,
  dataForCrud,
  callApiToUpdateUseTable,
  closeModal,
}) => {
  return (
    <>
      <div className="info">
        <b>Bàn ăn:</b>
        {data?.table?.name} - {data?.table?.categoryTable?.name} -{" "}
        {data?.table?.floor?.name} - Số chỗ: {data?.table?.seats}
      </div>
      <div className="info">
        <b>Thông tin đơn đặt bàn:</b>
        {/* <div className="sub-info">
          <b>- Mã đơn đặt bàn:</b>#{data?.orderTable?.id}
        </div> */}
        <div className="sub-info">
          <b>- Thời gian đặt bàn:</b>
          {data?.orderTable?.createAt}
        </div>
        <div className="sub-info">
          <b>- Thời gian nhận bàn:</b>
          {data?.orderTable?.arriveAt!
            ? data?.orderTable?.arriveAt
            : "Chưa cung cấp thời gian nhận bàn"}
        </div>
        <div className="sub-info">
          <b>- Số lượng khách:</b>
          {data?.orderTable?.guests}
        </div>
      </div>
      <div className="info">
        <b>Thông tin người đặt bàn:</b>
        <div className="sub-info">
          <b>- Họ và tên:</b>
          {data?.orderTable?.customerFullname}
        </div>
        <div className="sub-info">
          <b>- Số điện thoại:</b>
          {data?.orderTable?.customerPhone}
        </div>
        <div className="sub-info">
          <b>- Email:</b>
          {data?.orderTable?.customerEmail}
        </div>
        <div className="sub-info">
          <b>- Ghi chú:</b>
          {data?.orderTable?.customerNote}
        </div>
      </div>
      <div className="info">
        <b>Trạng thái:</b>
        <span className="status yellow">{data?.status}</span>
      </div>
      {hasPermission({
        isManager: isManager!,
        restaurantIdForCrud: restaurantId,
        validActions,
        requiredActionId: actionIndexes.update,
      }) && (
        <div className="modal__buttons mg-top-diff">
          <button
            type="button"
            className="modal__button secondary btn red-secondary"
            onClick={(e) =>
              callApiToUpdateUseTable!({
                id: data?.id,
                customerId: data?.orderTable?.customer?.id,
                customerFullname: data?.orderTable?.customerFullname,
                customerPhone: data?.orderTable?.customerPhone,
                customerEmail: data?.orderTable?.customerEmail,
                button: e.target as HTMLElement,
                value: UseTableStatus.occupied,
              })
            }
          >
            Khách nhận bàn
          </button>
          <button
            type="button"
            className="modal__button secondary btn green-secondary"
            onClick={(e) =>
              callApiToUpdateUseTable!({
                id: data?.id!,
                button: e.target as HTMLElement,
                value: UseTableStatus.empty,
              })
            }
          >
            {UseTableStatus.empty}
          </button>
        </div>
      )}
    </>
  );
};

export default ManagerReservedUseTable;
