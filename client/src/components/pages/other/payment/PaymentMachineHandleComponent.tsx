import CountdownTimerComponent from "../../../admin-manager/timing/CountdownTimerComponent";
import CurrentDateTimeComponent from "../../../admin-manager/timing/CurrentDateTimeComponent";
import { QRCode } from "antd";
import { ImageSourcePath } from "../../../../constants/values";
import {
  PaymentMethodAtmInfoValue,
  PaymentMethodImageValue,
  PaymentMethodTitleValue,
} from "../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { PaymentMachinePageProps } from "../../../../constants/props";

type PaymentMachineHandleComponentProps = Pick<
  PaymentMachinePageProps,
  | "methodTitle"
  | "methodImage"
  | "paymentId"
  | "paymentLogo"
  | "paymentQRCodeUrl"
  | "paymentResponseTime"
  | "paymentTotalPrice"
> & {
  onPaymentTimeout: () => Promise<void>;
};

const PaymentMachineHandleComponent: React.FC<
  PaymentMachineHandleComponentProps
> = ({
  methodTitle,
  methodImage,
  paymentId,
  paymentLogo,
  paymentQRCodeUrl,
  paymentResponseTime,
  paymentTotalPrice,
  onPaymentTimeout,
}) => {
  //
  const paymentByMoney =
    methodImage === PaymentMethodImageValue.moneyImage &&
    methodTitle === PaymentMethodTitleValue.moneyTitle;
  const paymentByBank =
    methodImage === PaymentMethodImageValue.atmLogo &&
    methodTitle === PaymentMethodTitleValue.atmTitle;
  const paymentByWallet =
    (methodImage === PaymentMethodImageValue.momoLogo &&
      methodTitle === PaymentMethodTitleValue.momoTitle) ||
    (methodImage === PaymentMethodImageValue.zalopayLogo &&
      methodTitle === PaymentMethodTitleValue.zalopayTitle);

  return (
    <div className="payment-machine__main-handle">
      <div className="payment-machine__main-handle-header">
        <img
          src={ImageSourcePath + methodImage}
          alt={methodImage}
          className="payment-machine__main-handle-image"
        />
        <h2 className="payment-machine__main-handle-title">{methodTitle}</h2>
      </div>
      <div className="payment-machine__main-handle-body">
        <div className="payment-machine__main-handle-info">
          {paymentByBank && (
            <>
              <p>
                <span>Ngân hàng: </span>
                <b>{PaymentMethodAtmInfoValue.atmBank}</b>
              </p>
              <p>
                <span>Số tài khoản: </span>
                <b>{PaymentMethodAtmInfoValue.atmIdCard}</b>
              </p>
              <p>
                <span>Họ và tên: </span>
                <b>{PaymentMethodAtmInfoValue.atmFullname}</b>
              </p>
            </>
          )}
          {paymentByWallet && (
            <p>
              <span>Mã giao dịch: </span>
              <b>{paymentId}</b>
            </p>
          )}
          <p>
            <span>Thời gian thanh toán: </span>
            <b>
              <CurrentDateTimeComponent />
            </b>
          </p>
          {paymentByWallet && (
            <p>
              <span>Thời hạn thanh toán: </span>
              <b>
                <CountdownTimerComponent
                  timeMs={paymentResponseTime! + 1000 * 60 * 5 - Date.now()}
                  onFinish={onPaymentTimeout}
                />
              </b>
            </p>
          )}
          <p>
            <span>Tổng thanh toán: </span>
            <b>{vietnamMoneyFormat(paymentTotalPrice || 0)}</b>
          </p>
          {paymentByMoney && (
            <img
              src={ImageSourcePath + PaymentMethodImageValue.savingImage}
              alt={PaymentMethodImageValue.savingImage}
            />
          )}
          {paymentQRCodeUrl && (
            <QRCode
              className="qr-code"
              errorLevel="H"
              value={paymentQRCodeUrl}
              icon={ImageSourcePath + paymentLogo}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMachineHandleComponent;
