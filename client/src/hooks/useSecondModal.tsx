import { useState, type JSX } from "react";

interface SecondModalState {
  title: string;
  open: boolean;
  width?: string;
  className?: string;
  children?: React.ReactNode | JSX.Element;
}

const useSecondModal = () => {
  const [secondModal, setSecondModal] = useState<SecondModalState>({
    title: "",
    open: false,
  });

  const openSecondModal = (payload: Omit<SecondModalState, "open">) => {
    setSecondModal({
      ...payload,
      open: true,
    });
  };

  const closeSecondModal = () => {
    setSecondModal({
      title: "",
      open: false,
    });
  };

  return {
    secondModal,
    setSecondModal,
    openSecondModal,
    closeSecondModal,
  };
};

export default useSecondModal;
