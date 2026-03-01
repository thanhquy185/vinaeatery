import { useState, type JSX } from "react";

export interface ModalState {
  title: string;
  open: boolean;
  width?: string;
  className?: string;
  children?: React.ReactNode | JSX.Element;
}

export function useModal() {
  const [modal, setModal] = useState<ModalState>({
    title: "",
    open: false,
  });

  const openModal = (payload: Omit<ModalState, "open">) => {
    setModal({
      ...payload,
      open: true,
    });
  };

  const closeModal = () => {
    setModal({
      title: "",
      open: false,
    });
  };

  return {
    modal,
    setModal,
    openModal,
    closeModal,
  };
}
