import CountdownTimerComponent from "../../admin-manager/CountdownTimerComponent";
import CurrentDateTimeComponent from "../../admin-manager/CurrentDateTimeComponent";
import { QRCode } from "antd";
import { ImageSourcePath } from "../../../constants/values";
import {
  PaymentMachineProcessStatusValue,
  PaymentMachineStatusValue,
  PaymentMethodAtmInfoValue,
  PaymentMethodImageValue,
  PaymentMethodTitleValue,
} from "../../../constants/values";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import type { PaymentMachinePageProps } from "../../../constants/props";
import type {
  PaymentMachineProcessStatusEnum,
  PaymentMachineStatusEnum,
} from "../../../constants/enums";

const PaymentMachineHandleComponent: React.FC<PaymentMachinePageProps> = ({
  paymentMachine,
  methodTitle,
  methodImage,
  paymentId,
  paymentLogo,
  paymentQRCodeUrl,
  paymentResponseTime,
  paymentTotalPrice,
  updateMutation,
  stomp,
  updateMethodInfo,
  updatePaymentInfo,
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

  // Thông báo: Khách hàng đổi phương thức thanh toán khác
  const handleSendPendingPaymentMachineInform = () => {
    const client = stomp?.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
    } else {
      client.send("/app/pending-payment-machine", {}, undefined);
    }
  };

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
                  onFinish={async () => {
                    if (
                      methodImage === PaymentMethodImageValue.momoLogo &&
                      methodTitle === PaymentMethodTitleValue.momoTitle
                    ) {
                      // const momoResponse = await MomoA ({
                      //   orderId: paymentId,
                      //   orderAmount: String(paymentTotalPrice),
                      // });
                      // const momoData = momoResponse!
                      //   .data as any;
                    }

                    const response = await updateMutation!.mutateAsync({
                      values: {
                        id: paymentMachine.id,
                        paymentMethodId: undefined,
                        paymentTotalPrice: undefined,
                        processStatus:
                          PaymentMachineProcessStatusValue.pending as PaymentMachineProcessStatusEnum,
                        status:
                          PaymentMachineStatusValue.processing as PaymentMachineStatusEnum,
                        feedbackExperience: undefined,
                        feedbackScore1: undefined,
                        feedbackScore2: undefined,
                        feedbackScore3: undefined,
                        feedbackScore4: undefined,
                        feedbackScore5: undefined,
                        feedbackMessage: undefined,
                      },
                    });
                    if (response) {
                      updateMethodInfo!({ image: "", title: "" });
                      updatePaymentInfo!({
                        id: "",
                        logo: "",
                        qrCodeUrl: "",
                        responseTime: 0,
                        totalPrice: 0,
                      });

                      handleSendPendingPaymentMachineInform();
                    }
                  }}
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
