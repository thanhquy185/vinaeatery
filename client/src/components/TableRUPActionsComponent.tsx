import { Eye, PenBox, Printer } from "lucide-react";
import { ModalTitleValue, ModalWidthValue } from "../constants/values";
import { actionIndexes, getActionNameEn } from "../utils/defaultActionsUtil";
import { hasPermission } from "../utils/hasPermissionsUtil";
import type { JSX } from "react";
import type { ModalState } from "../hooks/useModal";

type TableRUPActionsComponentProps<T = any> = {
  nameEN: string;
  nameVN: string;
  isManager: boolean;
  restaurantIdForCrud: number;
  validActions: string;
  record: T;
  modalWidth: string;
  managerModals: {
    detail: (data: T) => JSX.Element;
    update: (data: T) => JSX.Element;
    print: (data: T) => JSX.Element;
  };
  openModal: (payload: Omit<ModalState, "open">) => void;
};

const TableRUPActionsComponent: React.FC<TableRUPActionsComponentProps> = ({
  nameEN,
  nameVN,
  isManager,
  restaurantIdForCrud,
  validActions,
  record,
  modalWidth,
  managerModals,
  openModal,
}) => {
  return (
    <>
      {hasPermission({
        isManager,
        restaurantIdForCrud,
        validActions,
        requiredActionId: actionIndexes.detail,
      }) && (
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
      {hasPermission({
        isManager,
        restaurantIdForCrud,
        validActions,
        requiredActionId: actionIndexes.update,
      }) && (
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
      {hasPermission({
        isManager,
        restaurantIdForCrud,
        validActions,
        requiredActionId: actionIndexes.print,
      }) && (
        <button
          className={"action " + getActionNameEn(actionIndexes.print)}
          onClick={() =>
            openModal({
              title: ModalTitleValue.print(nameVN.toLowerCase()),
              width: ModalWidthValue.split3B,
              className: `${getActionNameEn(actionIndexes.print)} ${nameEN}`,
              children: managerModals.print(record),
            })
          }
        >
          <Printer />
        </button>
      )}
    </>
  );
};

export default TableRUPActionsComponent;
