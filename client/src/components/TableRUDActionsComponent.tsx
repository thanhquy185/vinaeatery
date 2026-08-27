import {
  Eye,
  Lock,
  PenBox,
  RotateCcwKey,
  Unlock,
  UserLock,
} from "lucide-react";
import {
  CommonStatusValue,
  ModalTitleValue,
  ModalWidthValue,
} from "../constants/values";
import { actionIndexes, getActionNameEn } from "../utils/defaultActionsUtil";
import { hasPermission } from "../utils/hasPermissionsUtil";
import type { JSX } from "react";
import type { ModalState } from "../hooks/useModal";

type TableRUDActionsComponentProps<T = any> = {
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
    lock: (id: number, status: string) => JSX.Element;
    lockUser?: (id: number, status: string) => JSX.Element;
    changePasswordUser?: (id: number) => JSX.Element;
  };
  openModal: (payload: Omit<ModalState, "open">) => void;
};

const TableRUDActionsComponent: React.FC<TableRUDActionsComponentProps> = ({
  nameEN,
  nameVN,
  isAdmin = false,
  isManager = false,
  hasLockUser = false,
  hasChangePasswordUser = false,
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
      {(isAdmin ||
        isManager ||
        hasPermission({
          isManager,
          restaurantIdForCrud,
          validActions,
          requiredActionId: actionIndexes.lock,
        })) && (
        <button
          className={"action " + getActionNameEn(actionIndexes.lock)}
          onClick={() =>
            openModal({
              title:
                record.status == CommonStatusValue.active
                  ? ModalTitleValue.lock(nameVN.toLowerCase())
                  : ModalTitleValue.unlock(nameVN.toLowerCase()),
              width: ModalWidthValue.lock,
              className: `${getActionNameEn(actionIndexes.lock)} ${nameEN}`,
              children: managerModals.lock(
                record?.id as number,
                record?.status!,
              ),
            })
          }
        >
          {record.status == CommonStatusValue.active ? <Lock /> : <Unlock />}
        </button>
      )}
      {hasLockUser &&
        (isAdmin ||
          isManager ||
          hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.lock,
          })) && (
          <button
            className={"action " + getActionNameEn(actionIndexes.lock)}
            onClick={() =>
              openModal({
                title:
                  record.user.status == CommonStatusValue.active
                    ? ModalTitleValue.lock("tài khoản")
                    : ModalTitleValue.unlock("tài khoản"),
                width: ModalWidthValue.lock,
                className: `${getActionNameEn(actionIndexes.lock)} ${nameEN}`,
                children: managerModals.lockUser!(
                  record.user.id,
                  record.user.status,
                ),
              })
            }
          >
            <UserLock />
          </button>
        )}
      {hasChangePasswordUser &&
        (isAdmin ||
          isManager ||
          hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.update,
          })) && (
          <button
            className={"action " + getActionNameEn(actionIndexes.print)}
            onClick={() =>
              openModal({
                title: ModalTitleValue.changePasswordUser("tài khoản"),
                width: ModalWidthValue.split1,
                className: `${getActionNameEn(actionIndexes.print)} ${nameEN}`,
                children: managerModals.changePasswordUser!(record.user.id),
              })
            }
          >
            <RotateCcwKey />
          </button>
        )}
    </>
  );
};

export default TableRUDActionsComponent;
