import ReactDOM from "react-dom";
import { Modal } from "antd";

type CustomModalProps = {
  title: string;
  openModal: boolean;
  setOpenModal: () => void;
  width: string;
  className?: string;
  children: React.ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  openModal,
  setOpenModal,
  width,
  className,
  children,
}) => {
  return ReactDOM.createPortal(
    <>
      <Modal
        title={title}
        centered
        open={openModal}
        onCancel={setOpenModal}
        footer={null} // Loại bỏ nút Ok và Cancel
        width={width}
        className={"modal" + (className ? " " + className : "")}
      >
        {children}
      </Modal>
    </>,
    document.body
  );
};

export default CustomModal;
