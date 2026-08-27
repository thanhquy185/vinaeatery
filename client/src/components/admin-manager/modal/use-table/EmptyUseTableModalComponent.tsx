import useEntityQuery from "../../../../hooks/useEntityQuery2";
import UseTableApiService from "../../../../services/api/v1/UseTableApiService";
import EmptyHandleOccupiedComponent from "./empty/EmptyHandleOccupiedComponent";
import EmptyHandleReservedComponent from "./empty/EmptyHandleReservedComponent";
import { useState } from "react";
import { Spin } from "antd";
import { UseTableStatusValue } from "../../../../constants/values";
import { actionIndexes } from "../../../../utils/defaultActionsUtil";
import { hasPermission } from "../../../../utils/hasPermissionsUtil";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { UseTableDetailResponseType } from "../../../../types/UseTableType";

const EmptyUseTableModalComponent: React.FC<CrudObjectModalProps> = ({
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
  // Bàn đã được đặt
  const [tableIsReserved, setTableIsReserved] = useState<boolean>(false);

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
            <b>Trạng thái:</b>
            <span className="status green">{useTableDetail.status}</span>
          </div>
          {(tableIsOccupied || tableIsReserved) && (
            <>
              <div className="line"></div>
              {tableIsOccupied && (
                <EmptyHandleOccupiedComponent
                  restaurantId={restaurantId!}
                  useTableId={useTableDetail.id}
                  setTableIsOccupied={setTableIsOccupied}
                  callApiToUpdateUseTable={callApiToUpdateUseTable!}
                />
              )}
              {tableIsReserved && (
                <EmptyHandleReservedComponent
                  restaurantId={restaurantId}
                  useTableId={useTableDetail.id}
                  callApiToUpdateUseTable={callApiToUpdateUseTable}
                  clickBack={() => setTableIsReserved(false)}
                />
              )}
            </>
          )}
          {hasPermission({
            isManager: isManager!,
            restaurantIdForCrud: restaurantId,
            validActions,
            requiredActionId: actionIndexes.update,
          }) && (
            <>
              {!tableIsOccupied && !tableIsReserved && (
                <div className="modal__buttons mg-top-diff">
                  <button
                    type="button"
                    className="modal__button secondary btn red-secondary"
                    onClick={() => setTableIsOccupied(true)}
                  >
                    {UseTableStatusValue.occupied}
                  </button>
                  <button
                    type="button"
                    className="modal__button secondary btn yellow-secondary"
                    onClick={() => setTableIsReserved(true)}
                  >
                    {UseTableStatusValue.reserved}
                  </button>
                  <button
                    type="button"
                    className="modal__button secondary btn gray-secondary"
                    onClick={(e) =>
                      callApiToUpdateUseTable!({
                        id: useTableDetail.id,
                        button: e.target as HTMLElement,
                        value: UseTableStatusValue.repair,
                      })
                    }
                  >
                    {UseTableStatusValue.repair}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </Spin>
  );
};

export default EmptyUseTableModalComponent;
