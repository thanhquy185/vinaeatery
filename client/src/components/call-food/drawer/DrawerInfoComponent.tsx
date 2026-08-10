import type { CallFoodPageProps } from "../../../constants/props";

const DrawerInfoComponent: React.FC<CallFoodPageProps> = ({
  currentUseTable,
}) => {
  return (
    <div className="call-food__info">
      <div className="call-food__info-block table">
        <h3>Bàn ăn</h3>
        <p>
          <span>Tên bàn:</span>
          <b>{currentUseTable.table.name}</b>
        </p>
        <p>
          <span>Loại bàn:</span>
          <b>{currentUseTable.table.categoryTable.name}</b>
        </p>
        <p>
          <span>Tầng:</span>
          <b>{currentUseTable.table.floor.name}</b>
        </p>
        <p>
          <span>Số chỗ:</span>
          <b>{currentUseTable.table.seats}</b>
        </p>
      </div>
      <div className="call-food__info-block customer">
        <h3>Khách hàng</h3>
        <p>
          <span>Họ và tên:</span>
          <b>{currentUseTable.customerFullname}</b>
        </p>
        <p>
          <span>Điện thoại:</span>
          <b>{currentUseTable.customerPhone}</b>
        </p>
        <p>
          <span>Email:</span>
          <b>{currentUseTable.customerEmail}</b>
        </p>
        <p>
          <span>Số lượng:</span>
          <b>
            {currentUseTable.customerGuests} (Người lớn:{" "}
            {currentUseTable.customerAdult}, Trẻ em:{" "}
            {currentUseTable.customerChild})
          </b>
        </p>
      </div>
    </div>
  );
};

export default DrawerInfoComponent;
