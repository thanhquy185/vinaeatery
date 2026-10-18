import type { JSX } from "react";
import type { ModalState } from "../../../hooks/useModal";

export type ManagerTableContext = {
  nameEN: string;
  nameVN: string;
  isManager: boolean;
  restaurantIdForCrud?: number;
  validActions?: string;
  openModal: (payload: Omit<ModalState, "open">) => void;
};

export type ManagerTableReadWriteModals<T> = {
  detail: (data: T) => JSX.Element;
  update: (data: T) => JSX.Element;
};

export type ManagerTableLockModals<T> = ManagerTableReadWriteModals<T> & {
  lock: (id: number, status: string) => JSX.Element;
};

export type ManagerTablePrintModals<T> = ManagerTableReadWriteModals<T> & {
  print: (data: T) => JSX.Element;
};
