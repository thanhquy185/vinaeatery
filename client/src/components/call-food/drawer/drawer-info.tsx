import type { FC } from "react";
import type { CallFoodLayoutProps } from "../../../layouts/call-food-layout";

// Drawer Info
const DrawerInfo: FC<CallFoodLayoutProps> = ({ currentUseTable }) => {
  return (
    <div className="call-food__info">
      <div className="call-food__info-block table">
        <h3>Bàn ăn</h3>
        <p>
          <span>Tên bàn:</span>
          <b>{currentUseTable?.table?.name}</b>
        </p>
        <p>
          <span>Loại bàn:</span>
          <b>{currentUseTable?.table?.categoryTable?.name}</b>
        </p>
        <p>
          <span>Tầng:</span>
          <b>{currentUseTable?.table?.floor?.name}</b>
        </p>
        <p>
          <span>Số chỗ:</span>
          <b>{currentUseTable?.table?.seats}</b>
        </p>
        <p>
          <span>Nhận bàn:</span>
          <b>{currentUseTable?.timeStart}</b>
        </p>
      </div>
      <div className="call-food__info-block customer">
        <h3>Khách hàng</h3>
        <p>
          <span>Họ và tên:</span>
          <b>{currentUseTable?.customerFullname}</b>
        </p>
        <p>
          <span>Điện thoại:</span>
          <b>{currentUseTable?.customerPhone}</b>
        </p>
        <p>
          <span>Email:</span>
          <b>{currentUseTable?.customerEmail}</b>
        </p>
      </div>
    </div>
  );
};

export default DrawerInfo;
