import { Image } from "antd";
import type { CallFoodPageProps } from "../../../constants/props";

const DrawerQRComponent: React.FC<CallFoodPageProps> = ({
  currentUseTable,
}) => {
  return (
    <>
      <p className="drawer__paragraph">
        Quét mã QR bên dưới để đặt món ăn bằng thiết bị của bạn (ấn vào ảnh để
        phóng to)
      </p>
      <Image
        src={
          "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=http://localhost:5173/client/" +
          currentUseTable.table.id
        }
        className="drawer__qr"
      />
    </>
  );
};

export default DrawerQRComponent;
