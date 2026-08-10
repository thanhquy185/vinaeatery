import ReactDOM from "react-dom";
import { Modal } from "antd";

type ModalComponentProps = {
  title: string;
  // openModal?: boolean;
  open?: boolean;
  width?: string;
  className?: string;
  children?: React.ReactNode;
  // setOpenModal?: () => void;
  setCloseModal?: () => void;
};

const ModalComponent: React.FC<ModalComponentProps> = ({
  title,
  // openModal,
  open,
  width,
  className,
  children,
  // setOpenModal,
  setCloseModal,
}) => {
  return ReactDOM.createPortal(
    <>
      <Modal
        title={title}
        centered
        open={open}
        footer={null} // Loại bỏ nút Ok và Cancel
        width={width}
        className={"modal" + (className ? " " + className : "")}
        onCancel={setCloseModal}
      >
        {children}
      </Modal>
    </>,
    document.body,
  );
};

export default ModalComponent;
