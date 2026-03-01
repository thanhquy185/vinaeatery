import type { FC } from "react";
import type { PaymentProps } from "../../../pages/other/payment";
import { HandlePaymentStatus, ImageSourcePath } from "../../../common/values";
import CurrentDateTime from "../../admin-manager/common/current-datetime";
import CountdownTimer from "../../admin-manager/common/count-down-timer";
import { vietnamMoneyFormat } from "../../../utils/other-events";
import { QRCode } from "antd";
import { useEntityMutation } from "../../../hook/use-entity-mutation";
import type { HandlePaymentType } from "../../../common/types";
import { HandleUpdateHandlePayment } from "../../../requests/handle-payments";
import { HandleCancelMomoOrder } from "../../../requests/wallets";

// Các gía trị chung
// - Thông tin tài khoản ngân hàng
const atmBank = "MB Bank";
const atmIdCard = "0123456789000000";
const atmFullname = "TRAN THANH QUY";
const atmQRCodeUrl = "123123123";
const mbbankLogo = "mbbank-logo.png";
// - Hình ảnh phương thức
const moneyImage = "money-image.png";
const savingImage = "saving-image.png";
const atmLogo = "atm-logo.png";
const visaMasterJcbLogo = "visa-master-jcb-logo.png";
const momoLogo = "momo-logo.png";
const zalopayLogo = "zalopay-logo.png";
const vnpayLogo = "vnpay-logo.png";
// - Tiêu đề phương thức
const moneyTitle = "Thanh toán bằng tiền mặt";
const atmTitle = "Thanh toán bằng ngân hàng";
const visMasterJcbTitle = "Thanh toán bằng Visa/Master/JCB";
const momoTitle = "Thanh toán bằng ví MoMo";
const zalopayTitle = "Thanh toán bằng ví ZaloPay";
const vnpayTitle = "Thanh toán bằng ví VNPay";

// Payment Pay
const PaymentPay: FC<PaymentProps> = ({
  nameEN,
  handlePayment,
  methodTitle,
  methodImage,
  payId,
  payLogo,
  payQRCodeUrl,
  payResponseTime,
  payTotalPrice,
  updateMethodInfo,
  updatePayInfo,
}) => {
  // Mutation
  const updateMutation = useEntityMutation<HandlePaymentType>({
    messages: {
      success: `Thanh toán hiện tại bị huỷ vì quá hạn thời gian thanh toán cho phép! Chuyển về trang chọn phương thức thanh toán!`,
      error: `Cập nhật thất bại!`,
    },
    invalidateKeys: [[nameEN]],
    api: HandleUpdateHandlePayment,
  });

  return (
    <div className="public__main-pay">
      <div className="public__main-pay-header">
        <img
          src={ImageSourcePath + methodImage}
          alt="pay-image"
          className="public__main-pay-image"
        />
        <h2 className="public__main-pay-title">{methodTitle}</h2>
      </div>
      <div className="public__main-pay-body">
        <div className="public__main-pay-info">
          {methodImage === atmLogo && methodTitle === atmTitle && (
            <>
              <p>
                <span>Ngân hàng: </span>
                <b>{atmBank}</b>
              </p>
              <p>
                <span>Số tài khoản: </span>
                <b>{atmIdCard}</b>
              </p>
              <p>
                <span>Họ và tên: </span>
                <b>{atmFullname}</b>
              </p>
            </>
          )}
          {((methodImage === momoLogo && methodTitle === momoTitle) ||
            (methodImage === zalopayLogo && methodTitle === zalopayTitle)) && (
            <p>
              <span>Mã giao dịch: </span>
              <b>{payId}</b>
            </p>
          )}
          <p>
            <span>Thời gian thanh toán: </span>
            <b>
              <CurrentDateTime />
            </b>
          </p>
          {((methodImage === momoLogo && methodTitle === momoTitle) ||
            (methodImage === zalopayLogo && methodTitle === zalopayTitle)) && (
            <p>
              <span>Thời hạn thanh toán: </span>
              <b>
                <CountdownTimer
                  timeMs={payResponseTime! + 1000 * 60 * 5 - Date.now()}
                  onFinish={async () => {
                    if (methodImage === momoLogo && methodTitle === momoTitle) {
                      const momoResponse = await HandleCancelMomoOrder({
                        orderId: payId,
                        orderAmount: String(payTotalPrice),
                      });
                      // const momoData = momoResponse!
                      //   .data as any;
                    }

                    const response = await updateMutation.mutateAsync({
                      values: {
                        id: handlePayment?.id,
                        useTableId: handlePayment?.useTable?.id,
                        payMethodId: undefined,
                        isEmployeeHandle: true,
                        status: HandlePaymentStatus.pending,
                      },
                    });
                    if (data) {
                      updateMethodInfo!("", "", null);
                      updatePayInfo!("", "", "", 0, 0);
                    }
                  }}
                />
              </b>
            </p>
          )}
          <p>
            <span>Tổng thanh toán: </span>
            <b>{vietnamMoneyFormat(payTotalPrice!)} VNĐ</b>
          </p>
          {payQRCodeUrl && (
            <QRCode
              className="qr-code"
              errorLevel="H"
              value={payQRCodeUrl}
              icon={ImageSourcePath + payLogo}
            />
          )}
          {methodImage === moneyImage && methodTitle === moneyTitle && (
            <img src={ImageSourcePath + savingImage} alt="saving-image" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPay;
