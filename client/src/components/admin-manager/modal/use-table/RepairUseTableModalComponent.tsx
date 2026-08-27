import useEntityQuery from "../../../../hooks/useEntityQuery2";
import UseTableApiService from "../../../../services/api/v1/UseTableApiService";
import { Spin } from "antd";
import { UseTableStatusValue } from "../../../../constants/values";
import { actionIndexes } from "../../../../utils/defaultActionsUtil";
import { hasPermission } from "../../../../utils/hasPermissionsUtil";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { UseTableDetailResponseType } from "../../../../types/UseTableType";

const RepairUseTableModalComponent: React.FC<CrudObjectModalProps> = ({
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
            <span className="status gray">{useTableDetail.status}</span>
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

export default RepairUseTableModalComponent;
