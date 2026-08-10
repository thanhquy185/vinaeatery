import CurrentDateTimeComponent from "../../../CurrentDateTimeComponent";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../../utils/otherEvents";
import type { PaymentMachineInfoResponseType } from "../../../../../types/PaymentMachineType";

type OccupiedPaymentInfoComponentComponentProps = {
  paymentMachine: PaymentMachineInfoResponseType;
};

const OccupiedPaymentInfoComponentComponent: React.FC<
  OccupiedPaymentInfoComponentComponentProps
> = ({ paymentMachine }) => {
  return (
    <>
      <div className="info">
        <b>Nhân viên xác nhận:</b>
        <div className="sub-info">
          <b>- Họ và tên:</b>
          {paymentMachine.employee.fullname}
        </div>
        <div className="sub-info">
          <b>- Số điện thoại:</b>
          {paymentMachine.employee.phone}
        </div>
        <div className="sub-info">
          <b>- Email:</b>
          {paymentMachine.employee.email}
        </div>
      </div>
      <div className="info">
        <b>Thông tin thanh toán:</b>
        <div className="sub-info">
          <b>- Thời gian thanh toán:</b>
          <CurrentDateTimeComponent />
        </div>
        <div className="sub-info">
          <b>- Tổng tiền:</b>
          {vietnamMoneyFormat(paymentMachine.totalPrice)} (
          {numberToVietnamWords(paymentMachine.totalPrice)})
        </div>
        <div className="sub-sub-info">
          <b>+ Tiền món ăn:</b>
          {vietnamMoneyFormat(paymentMachine.foodPrice)}
        </div>
        <div className="sub-sub-info">
          <b>+ Phụ thu loại bàn:</b>+
          {vietnamMoneyFormat(paymentMachine.categoryTableSurcharge)}
        </div>
        <div className="sub-sub-info">
          <b>+ Giảm giá khách hàng:</b>-
          {vietnamMoneyFormat(paymentMachine.customerDiscount)}
        </div>
      </div>
      <div className="info">
        <b>Chi tiết đã phục vụ:</b>
        <table>
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
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {(paymentMachine.paymentMachineFoods || []).map(
              (paymentMachineFood) => (
                <tr key={paymentMachineFood.food.id}>
                  <td>{paymentMachineFood.foodNameSnapshot}</td>
                  <td>{paymentMachineFood.foodUnitSnapshot}</td>
                  <td>{paymentMachineFood.quantity}</td>
                  <td>
                    {vietnamMoneyFormat(paymentMachineFood.foodPriceSnapshot)}
                  </td>
                  <td>
                    {vietnamMoneyFormat(paymentMachineFood.totalPriceDetail)}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {/* <div className="note">
              *Lưu ý: Khi thanh toán, các phiếu gọi món chưa được phục vụ sẽ bị
              huỷ !
            </div> */}
      </div>
    </>
  );
};

export default OccupiedPaymentInfoComponentComponent;
