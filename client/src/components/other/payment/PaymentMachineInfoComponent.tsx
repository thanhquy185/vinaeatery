import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import { CategoryTableSurchargeTypeValue } from "../../../constants/values";
import type { PaymentMachinePageProps } from "../../../constants/props";

const PaymentMachineInfoComponent: React.FC<PaymentMachinePageProps> = ({
  paymentMachine,
}) => {
  return (
    <div className="payment-machine__main-info">
      <div className="payment-machine__main-info-list-warper">
        <table className="payment-machine__main-info-list">
          <colgroup>
            <col width="40%" />
            <col width="10%" />
            <col width="15%" />
            <col width="15%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th>Tên món ăn</th>
              <th>Đơn vị</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {paymentMachine.paymentMachineFoods.map(
              (paymentMachineFood, index) => (
                <tr key={index}>
                  <td>{paymentMachineFood.foodNameSnapshot}</td>
                  <td>{paymentMachineFood.foodUnitSnapshot}</td>
                  <td>
                    {vietnamMoneyFormat(paymentMachineFood.foodPriceSnapshot)}
                  </td>
                  <td>{paymentMachineFood.quantity}</td>
                  <td>
                    {vietnamMoneyFormat(paymentMachineFood.totalPriceDetail)}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <div className="payment-machine__main-info-payment-group">
        <div className="payment-machine__main-info-payment">
          <h2>Bàn ăn</h2>
          <p>
            <span>Tên bàn ăn:</span>
            <b>{paymentMachine.useTable.table.name}</b>
          </p>
          <p>
            <span>Loại bàn ăn:</span>
            <b>
              {paymentMachine.useTable.table.categoryTable.name} (Thu{" "}
              {paymentMachine.useTable.table.categoryTable.surchargeType ===
              CategoryTableSurchargeTypeValue.percent
                ? (paymentMachine.useTable.table.categoryTable.surchargeValue ||
                    0) + "%"
                : (paymentMachine.useTable.table.categoryTable
                    ?.surchargeValue || 0) + "đ"}
              )
            </b>
          </p>
          <p>
            <span>Tầng:</span>
            <b>{paymentMachine.useTable.table.floor.name}</b>
          </p>
        </div>
        <div className="payment-machine__main-info-payment">
          <h2>Khách hàng</h2>
          <p>
            <span>Họ và tên:</span>
            <b>{paymentMachine.useTable.customerFullname}</b>
          </p>
          <p>
            <span>Số điện thoại:</span>
            <b>{paymentMachine.useTable.customerPhone}</b>
          </p>
          <p>
            <span>Email:</span>
            <b>{paymentMachine.useTable.customerEmail}</b>
          </p>
        </div>
        <div className="payment-machine__main-info-payment">
          <h2>Hoá đơn</h2>
          <p>
            <span>Tổng tiền món ăn:</span>
            <b>{vietnamMoneyFormat(paymentMachine.foodPrice)}</b>
          </p>
          <p>
            <span>Giảm giá khách hàng:</span>
            <b>-{vietnamMoneyFormat(paymentMachine.customerDiscount)}</b>
          </p>
          <p>
            <span>Phụ thu loại bàn:</span>
            <b>+{vietnamMoneyFormat(paymentMachine.categoryTableSurcharge)}</b>
          </p>
          <div className="payment-machine__main-info-payment-line"></div>
          <p className="total-price">
            <span>Tổng tiền thanh toán:</span>
            <b>{vietnamMoneyFormat(paymentMachine.totalPrice)}</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMachineInfoComponent;
