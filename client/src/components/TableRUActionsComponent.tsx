import { Eye, PenBox } from "lucide-react";
import { ModalTitleValue } from "../constants/values";
import { actionIndexes, getActionNameEn } from "../utils/defaultActionsUtil";
import { hasPermission } from "../utils/hasPermissionsUtil";
import type { JSX } from "react";
import type { ModalState } from "../hooks/useModal";

type TableRUActionsComponentProps<T = any> = {
  nameEN: string;
  nameVN: string;
  isAdmin?: boolean;
  isManager?: boolean;
  hasLockUser?: boolean;
  hasChangePasswordUser?: boolean;
  restaurantIdForCrud?: number;
  validActions?: string;
  record: T;
  modalWidth: string;
  managerModals: {
    detail: (data: T) => JSX.Element;
    update: (data: T) => JSX.Element;
  };
  openModal: (payload: Omit<ModalState, "open">) => void;
};

const TableRUActionsComponent: React.FC<TableRUActionsComponentProps> = ({
  nameEN,
  nameVN,
  isAdmin = false,
  isManager = false,
  restaurantIdForCrud = 0,
  validActions = undefined,
  record,
  modalWidth,
  managerModals,
  openModal,
}) => {
  return (
    <>
      {(isAdmin ||
        isManager ||
        hasPermission({
          isManager,
          restaurantIdForCrud,
          validActions,
          requiredActionId: actionIndexes.detail,
        })) && (
        <button
          className={"action " + getActionNameEn(actionIndexes.detail)}
          onClick={() =>
            openModal({
              title: ModalTitleValue.detail(nameVN.toLowerCase()),
              width: modalWidth,
              className: `${getActionNameEn(actionIndexes.detail)} ${nameEN}`,
              children: managerModals.detail(record),
            })
          }
        >
          <Eye />
        </button>
      )}
      {(isAdmin ||
        isManager ||
        hasPermission({
          isManager,
          restaurantIdForCrud,
          validActions,
          requiredActionId: actionIndexes.update,
        })) && (
        <button
          className={"action " + getActionNameEn(actionIndexes.update)}
          onClick={() =>
            openModal({
              title: ModalTitleValue.update(nameVN.toLowerCase()),
              width: modalWidth,
              className: `${getActionNameEn(actionIndexes.update)} ${nameEN}`,
              children: managerModals.update(record),
            })
          }
        >
          <PenBox />
        </button>
      )}
    </>
  );
};

export default TableRUActionsComponent;
