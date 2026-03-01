import type { FC } from "react";
import { vietnamMoneyFormat } from "../../../utils/other-events";
import type { PaymentProps } from "../../../pages/other/payment";
import { CategoryTableSurchargeType } from "../../../common/values";

// Payment Info
const PaymentInfo: FC<PaymentProps> = ({
  handlePayment,
  orderSheetDetails,
  totalFoodPrice,
  categoryTableSurcharge,
  customerDiscount,
}) => {
  return (
    <div className="public__main-info">
      <div className="public__main-info-list-warper">
        <table className="public__main-info-list">
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
            {orderSheetDetails?.map((orderSheet, index) => (
              <tr key={index}>
                <td>{orderSheet?.food?.name}</td>
                <td>{orderSheet?.food?.unit}</td>
                <td>{vietnamMoneyFormat(orderSheet.price)}</td>
                <td>{orderSheet.quantity}</td>
                <td>
                  {vietnamMoneyFormat(orderSheet.price * orderSheet.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="public__main-info-payment-group">
        <div className="public__main-info-payment">
          <h2>Khách hàng</h2>
          <p>
            <span>Họ và tên:</span>
            <b>{handlePayment?.useTable?.customerFullname}</b>
          </p>
          <p>
            <span>Số điện thoại:</span>
            <b>{handlePayment?.useTable?.customerPhone}</b>
          </p>
          <p>
            <span>Email:</span>
            <b>{handlePayment?.useTable?.customerEmail}</b>
          </p>
          {/* <p>
                            <span>Thẻ khách hàng:</span>
                            <b>
                              {
                                handlePayment?.useTable?.customer?.customerCard
                                  ?.name
                              }{" "}
                              (Giảm{" "}
                              {
                                handlePayment?.useTable?.customer?.customerCard
                                  ?.discount
                              }
                              %)
                            </b>
                          </p> */}
        </div>
        <div className="public__main-info-payment">
          <h2>Bàn ăn</h2>
          <p>
            <span>Tên bàn ăn:</span>
            <b>{handlePayment?.useTable?.table?.name}</b>
          </p>
          <p>
            <span>Loại bàn ăn:</span>
            <b>
              {handlePayment?.useTable?.table?.categoryTable?.name} (Thu{" "}
              {handlePayment?.useTable?.table?.categoryTable?.surchargeType ===
              CategoryTableSurchargeType.percent
                ? (handlePayment?.useTable?.table?.categoryTable
                    ?.surchargeValue || 0) + "%"
                : (handlePayment?.useTable?.table?.categoryTable
                    ?.surchargeValue || 0) + "đ"}
              )
              {/* {handlePayment?.useTable?.table?.categoryTable
                                ?.surchargeType ===
                                CategoryTableSurchargeType.fixed &&}
                              ) */}
            </b>
          </p>
          <p>
            <span>Tầng:</span>
            <b>{handlePayment?.useTable?.table?.floor?.name}</b>
          </p>
        </div>
        <div className="public__main-info-payment">
          <h2>Hoá đơn</h2>
          <p>
            <span>Tổng tiền món ăn:</span>
            <b>{vietnamMoneyFormat(totalFoodPrice!)}</b>
          </p>
          <p>
            <span>Giảm giá khách hàng:</span>
            <b>{vietnamMoneyFormat(-1 * customerDiscount!)}</b>
          </p>
          <p>
            <span>Phụ thu loại bàn:</span>
            <b>{vietnamMoneyFormat(categoryTableSurcharge!)}</b>
          </p>
          <div className="public__main-info-payment-line"></div>
          <p className="total-price">
            <span>Tổng tiền thanh toán:</span>
            <b>
              {vietnamMoneyFormat(
                Math.round(
                  totalFoodPrice! +
                    categoryTableSurcharge! +
                    -1 * customerDiscount!,
                ),
              )}
            </b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
