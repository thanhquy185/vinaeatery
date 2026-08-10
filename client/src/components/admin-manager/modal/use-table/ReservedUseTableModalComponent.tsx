import useEntityQuery from "../../../../hooks/useEntityQuery2";
import ReservedHandleOccupiedComponent from "./reserved/ReservedHandleOccupiedComponent";
import UseTableApiService from "../../../../services/api/v1/UseTableApiService";
import { Spin } from "antd";
import { useState } from "react";
import { UseTableStatusValue } from "../../../../constants/values";
import { actionIndexes } from "../../../../utils/defaultActions";
import { hasPermission } from "../../../../utils/hasPermissions";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { UseTableDetailResponseType } from "../../../../types/UseTableType";

const ReservedUseTableModalComponent: React.FC<CrudObjectModalProps> = ({
  isManager,
  restaurantId,
  validActions,
  data,
  callApiToUpdateUseTable,
}) => {
  const { data: useTableDetail, isLoading } =
    useEntityQuery<UseTableDetailResponseType>({
      keys: ["use-table", data.id],
      params: { id: data.id },
      api: UseTableApiService.handleGetDetailById,
    });

  // Bàn đang có khách
  const [tableIsOccupied, setTableIsOccupied] = useState<boolean>(false);

  return (
    <Spin spinning={!useTableDetail || isLoading}>
      {useTableDetail && (
        <>
          <div className="info">
            <b>Thông tin bàn ăn:</b>
            <div className="sub-info">
              <b>- Tên bàn:</b>
              {useTableDetail.table.name}
            </div>
            <div className="sub-info">
              <b>- Loại bàn:</b>
              {useTableDetail.table.categoryTable.name}
            </div>
            <div className="sub-info">
              <b>- Tầng:</b>
              {useTableDetail.table.floor.name}
            </div>
          </div>
          <div className="info">
            <b>Thông tin đơn đặt bàn:</b>
            <div className="sub-info">
              <b>- Thời gian đặt bàn:</b>
              {useTableDetail.reservation.createAt}
            </div>
            <div className="sub-info">
              <b>- Thời gian nhận bàn:</b>
              {useTableDetail.reservation.arriveAt}
            </div>
            <div className="sub-info">
              <b>- Số lượng khách:</b>
              {useTableDetail.reservation.customerGuests}
            </div>
          </div>
          <div className="info">
            <b>Thông tin người đặt bàn:</b>
            <div className="sub-info">
              <b>- Họ và tên:</b>
              {useTableDetail.reservation.customerFullname}
            </div>
            <div className="sub-info">
              <b>- Số điện thoại:</b>
              {useTableDetail.reservation.customerPhone}
            </div>
            <div className="sub-info">
              <b>- Email:</b>
              {useTableDetail.reservation.customerEmail}
            </div>
            <div className="sub-info">
              <b>- Ghi chú:</b>
              {useTableDetail.reservation.customerNote}
            </div>
          </div>
          <div className="info">
            <b>Trạng thái:</b>
            <span className="status yellow">{useTableDetail.status}</span>
          </div>
          {tableIsOccupied && (
            <>
              <div className="line"></div>
              <ReservedHandleOccupiedComponent
                restaurantId={restaurantId!}
                useTableId={useTableDetail.id}
                useTable={useTableDetail}
                setTableIsOccupied={setTableIsOccupied}
                callApiToUpdateUseTable={callApiToUpdateUseTable!}
              />
            </>
          )}
          {hasPermission({
            isManager: isManager!,
            restaurantIdForCrud: restaurantId,
            validActions,
            requiredActionId: actionIndexes.update,
          }) &&
            !tableIsOccupied && (
              <div className="modal__buttons mg-top-diff">
                <button
                  type="button"
                  className="modal__button secondary btn red-secondary"
                  onClick={() => setTableIsOccupied(true)}
                >
                  Khách nhận bàn
                </button>
                <button
                  type="button"
                  className="modal__button secondary btn green-secondary"
                  onClick={(e) =>
                    callApiToUpdateUseTable!({
                      id: useTableDetail.id,
                      button: e.target as HTMLElement,
                      value: UseTableStatusValue.empty,
                    })
                  }
                >
                  {UseTableStatusValue.empty}
                </button>
              </div>
            )}
        </>
      )}
    </Spin>
  );
};

export default ReservedUseTableModalComponent;
