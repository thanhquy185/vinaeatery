import type { CrudObjectModalProps } from "../../../../common/props";
import { UseTableStatus } from "../../../../common/values";
import { actionIndexes } from "../../../../utils/default-actions";
import { hasPermission } from "../../../../utils/has-permissions";

// Manager Repair Order Table
const ManagerRepairUseTable: React.FC<CrudObjectModalProps> = ({
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
  return (
    <>
      <div className="info">
        <b>Bàn ăn:</b>
        {/* <div className="sub-info">
          <b>- Tên bàn:</b>
          {data?.table?.name}
        </div>
        <div className="sub-info">
          <b>- Tầng:</b>
          {data?.table?.floor?.name}
        </div>
        <div className="sub-info">
          <b>- Số chỗ:</b>
          {data?.table?.seats}
        </div> */}
        {data?.table.name} - {data?.table.categoryTable!.name} -{" "}
        {data?.table.floor!.name} - Số chỗ: {data?.table.seats}
      </div>
      <div className="info">
        <b>Trạng thái:</b>
        <span className="status gray">{data?.status!}</span>
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

export default ManagerRepairUseTable;
