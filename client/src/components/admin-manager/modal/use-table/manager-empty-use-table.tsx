import { useState } from "react";
import { Radio } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { UseTableStatus } from "../../../../common/values";
import ManagerEmptyHandleOccupiedHasAccount from "./empty/manager-empty-handle-occupied-has-account";
import ManagerEmptyHandleOccupiedHasNotAccount from "./empty/manager-empty-handle-occupied-has-not-account";
import ManagerEmptyHandleReserved from "./empty/manager-empty-handle-reserved";
import { actionIndexes } from "../../../../utils/default-actions";
import { hasPermission } from "../../../../utils/has-permissions";

// Manager Empty Order Table
const ManagerEmptyUseTable: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  isManager,
  restaurantId,
  validActions,
  data,
  dataForCrud,
  closeModal,
  callApiToUpdateUseTable,
}) => {
  // Bàn đang có khách
  // - State
  const [tableIsOccupied, setTableIsOccupied] = useState<boolean>(false);
  // - State lưu giá trị radio
  const [customerHasAccount, setCustomerHasAccount] = useState<boolean>(true);

  // Bàn đã được đặt
  const [tableIsReserved, setTableIsReserved] = useState<boolean>(false);

  return (
    <>
      <div className="info">
        <b>Bàn ăn:</b>
        {data?.table?.name} - {data?.table?.categoryTable?.name} -{" "}
        {data?.table?.floor?.name} - Số chỗ: {data?.table?.seats}
      </div>
      <div className="info">
        <b>Trạng thái:</b>
        <span className="status green">{data?.status!}</span>
      </div>
      {(tableIsOccupied || tableIsReserved) && (
        <>
          <div className="line"></div>
          {tableIsOccupied && (
            <>
              <div className="info diff">
                <b>Bàn đang có khách</b>
                <Radio.Group
                  defaultValue={true}
                  buttonStyle="solid"
                  style={{ width: "100%", margin: "10px 0 16px" }}
                  onChange={(e) => setCustomerHasAccount(e.target.value)}
                >
                  <Radio.Button value={true}>
                    Khách đã có thông tin tài khoản trên hệ thống
                  </Radio.Button>
                  <Radio.Button value={false}>
                    Khách chưa có thông tin tài khoản trên hệ thống
                  </Radio.Button>
                </Radio.Group>
                {customerHasAccount && (
                  <ManagerEmptyHandleOccupiedHasAccount
                    restaurantId={restaurantId}
                    useTableId={data?.id}
                    callApiToUpdateUseTable={callApiToUpdateUseTable}
                    clickBack={() => setTableIsOccupied(false)}
                  />
                )}
                {!customerHasAccount && (
                  <ManagerEmptyHandleOccupiedHasNotAccount
                    restaurantId={restaurantId}
                    useTableId={data?.id}
                    callApiToUpdateUseTable={callApiToUpdateUseTable}
                    clickBack={() => setTableIsOccupied(false)}
                  />
                )}
              </div>
            </>
          )}
          {tableIsReserved && (
            <ManagerEmptyHandleReserved
              restaurantId={restaurantId}
              useTableId={data?.id}
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
        <div className="modal__buttons mg-top-diff">
          {!tableIsOccupied && !tableIsReserved && (
            <>
              <button
                type="button"
                className="modal__button secondary btn red-secondary"
                onClick={() => {
                  setCustomerHasAccount(true);
                  setTableIsOccupied(true);
                }}
              >
                {UseTableStatus.occupied}
              </button>
              <button
                type="button"
                className="modal__button secondary btn yellow-secondary"
                onClick={() => setTableIsReserved(true)}
              >
                {UseTableStatus.reserved}
              </button>
              <button
                type="button"
                className="modal__button secondary btn gray-secondary"
                onClick={(e) =>
                  callApiToUpdateUseTable!({
                    id: data?.id!,
                    button: e.target as HTMLElement,
                    value: UseTableStatus.repair,
                  })
                }
              >
                {UseTableStatus.repair}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ManagerEmptyUseTable;
