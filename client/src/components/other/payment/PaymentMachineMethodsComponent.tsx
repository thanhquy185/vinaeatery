import MoMoApiService from "../../../services/api/v1/MoMoApiService";
import ZaloPayApiService from "../../../services/api/v1/ZaloPayApiService";
import { useRef } from "react";
import {
  PaymentMethodAtmInfoValue,
  ImageSourcePath,
  PaymentMachineProcessStatusValue,
  PaymentMachineStatusValue,
  PaymentMethodImageValue,
  PaymentMethodTitleValue,
} from "../../../constants/values";
import { openConfirmation } from "../../../utils/showConfirmation";
import type { PaymentMachinePageProps } from "../../../constants/props";
import type {
  PaymentMachineProcessStatusEnum,
  PaymentMachineStatusEnum,
} from "../../../constants/enums";

const PaymentMachineMethodsComponent: React.FC<PaymentMachinePageProps> = ({
  paymentMachine,
  updateMutation,
  stomp,
  updateMethodInfo,
  updatePaymentInfo,
}) => {
  // Các biến giữ ref
  const moneyButtonRef = useRef<HTMLButtonElement>(null);
  const atmButtonRef = useRef<HTMLButtonElement>(null);
  const momoButtonRef = useRef<HTMLButtonElement>(null);
  const zalopayButtonRef = useRef<HTMLButtonElement>(null);

  // Thông báo: Khách hàng đã chọn 1 phương thức thanh toán
  const handleSelectedPaymentMachineInform = () => {
    const client = stomp?.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
    } else {
      client.send("/app/selected-payment-machine", {}, undefined);
    }
  };

  return (
    <div className="payment-machine__main-methods">
      <button
        ref={moneyButtonRef}
        className="payment-machine__main-method"
        onClick={async () => {
          if (!moneyButtonRef.current) return;

          moneyButtonRef.current.classList.add("active");

          const answer = await openConfirmation({
            title: `Thanh toán phương thức này ?`,
            content: `Bạn sắp chọn phương thức thanh toán "${PaymentMethodTitleValue.moneyTitle}" để thanh toán hoá đơn.`,
          });

          if (moneyButtonRef.current) {
            if (answer) {
              const response = await updateMutation!.mutateAsync({
                values: {
                  id: paymentMachine.id,
                  paymentMethodId: 1,
                  paymentTotalPrice: undefined,
                  processStatus:
                    PaymentMachineProcessStatusValue.selected as PaymentMachineProcessStatusEnum,
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
                updateMethodInfo!({
                  image: PaymentMethodImageValue.moneyImage,
                  title: PaymentMethodTitleValue.moneyTitle,
                });
                updatePaymentInfo!({
                  id: "Lưu trữ nội bộ",
                  logo: "",
                  qrCodeUrl: "",
                  responseTime: Date.now(),
                  totalPrice: paymentMachine.totalPrice,
                });

                handleSelectedPaymentMachineInform();
              }
            }
          }

          moneyButtonRef.current.classList.remove("active");
        }}
      >
        <img
          src={ImageSourcePath + PaymentMethodImageValue.moneyImage}
          alt={PaymentMethodImageValue.moneyImage}
        />
        <p>{PaymentMethodTitleValue.moneyTitle}</p>
      </button>
      <button
        ref={momoButtonRef}
        className="payment-machine__main-method"
        onClick={async () => {
          if (!momoButtonRef.current) return;

          momoButtonRef.current.classList.add("active");

          const answer = await openConfirmation({
            title: `Thanh toán phương thức này ?`,
            content: `Bạn sắp chọn phương thức thanh toán "${PaymentMethodTitleValue.moneyTitle}" để thanh toán hoá đơn.`,
          });

          if (momoButtonRef.current) {
            if (answer) {
              const response = await updateMutation!.mutateAsync({
                values: {
                  id: paymentMachine.id,
                  paymentMethodId: 4,
                  paymentTotalPrice: undefined,
                  processStatus:
                    PaymentMachineProcessStatusValue.selected as PaymentMachineProcessStatusEnum,
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
                const momoResponse = await MoMoApiService.handleCreateOrder({
                  paymentMachineId: paymentMachine.id,
                });
                const momoData = momoResponse.data;

                if (momoData) {
                  console.log(momoData);
                  updateMethodInfo!({
                    image: PaymentMethodImageValue.momoLogo,
                    title: PaymentMethodTitleValue.momoTitle,
                  });
                  updatePaymentInfo!({
                    id: momoData.orderId,
                    logo: PaymentMethodImageValue.momoLogo,
                    qrCodeUrl: momoData.qrCodeUrl,
                    responseTime: momoData.responseTime,
                    totalPrice: momoData.amount,
                  });

                  handleSelectedPaymentMachineInform();
                }
              }
            }
            momoButtonRef.current.classList.remove("active");
          }
        }}
      >
        <img
          src={ImageSourcePath + PaymentMethodImageValue.momoLogo}
          alt={PaymentMethodImageValue.momoLogo}
        />
        <p>{PaymentMethodTitleValue.moneyTitle}</p>
      </button>
      <button
        ref={atmButtonRef}
        className="payment-machine__main-method"
        onClick={async () => {
          if (!atmButtonRef.current) return;

          atmButtonRef.current.classList.add("active");

          const answer = await openConfirmation({
            title: `Thanh toán phương thức này ?`,
            content: `Bạn sắp chọn phương thức thanh toán "${PaymentMethodTitleValue.atmTitle}" để thanh toán hoá đơn.`,
          });

          if (atmButtonRef.current) {
            if (answer) {
              const response = await updateMutation!.mutateAsync({
                values: {
                  id: paymentMachine.id,
                  paymentMethodId: 2,
                  paymentTotalPrice: undefined,
                  processStatus:
                    PaymentMachineProcessStatusValue.selected as PaymentMachineProcessStatusEnum,
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
                updateMethodInfo!({
                  image: PaymentMethodImageValue.atmLogo,
                  title: PaymentMethodTitleValue.atmTitle,
                });
                updatePaymentInfo!({
                  id: "Lưu trữ nội bộ",
                  logo: PaymentMethodAtmInfoValue.mbbankLogo,
                  qrCodeUrl: PaymentMethodAtmInfoValue.atmQRCodeUrl,
                  responseTime: Date.now(),
                  totalPrice: paymentMachine.totalPrice,
                });

                handleSelectedPaymentMachineInform();
              }
            }
          }

          atmButtonRef.current.classList.remove("active");
        }}
      >
        <img
          src={ImageSourcePath + PaymentMethodImageValue.atmLogo}
          alt="atm-logo"
        />
        <p>{PaymentMethodTitleValue.atmTitle}</p>
      </button>
      <button
        ref={zalopayButtonRef}
        className="payment-machine__main-method"
        onClick={async () => {
          if (!zalopayButtonRef.current) return;

          zalopayButtonRef.current.classList.add("active");

          const answer = await openConfirmation({
            title: `Thanh toán phương thức này ?`,
            content: `Bạn sắp chọn phương thức thanh toán "${PaymentMethodTitleValue.zalopayTitle}" để thanh toán hoá đơn.`,
          });

          if (zalopayButtonRef.current) {
            if (answer) {
              const response = await updateMutation!.mutateAsync({
                values: {
                  id: paymentMachine.id,
                  paymentMethodId: 5,
                  paymentTotalPrice: undefined,
                  processStatus:
                    PaymentMachineProcessStatusValue.selected as PaymentMachineProcessStatusEnum,
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
                const zalopayResponse =
                  await ZaloPayApiService.handleCreateOrder({
                    paymentMachineId: paymentMachine.id,
                  });
                const zalopayData = zalopayResponse.data as any;

                if (zalopayData) {
                  console.log(zalopayData);
                  updateMethodInfo!({
                    image: PaymentMethodImageValue.zalopayLogo,
                    title: PaymentMethodTitleValue.zalopayTitle,
                  });
                  updatePaymentInfo!({
                    id: zalopayData.app_trans_id,
                    logo: PaymentMethodImageValue.zalopayLogo,
                    qrCodeUrl: zalopayData.order_url,
                    responseTime: zalopayData.app_time,
                    totalPrice: zalopayData.amount,
                  });

                  handleSelectedPaymentMachineInform();
                }
              }
            }
            zalopayButtonRef.current.classList.remove("active");
          }
        }}
      >
        <img
          src={ImageSourcePath + PaymentMethodImageValue.zalopayLogo}
          alt={PaymentMethodImageValue.zalopayLogo}
        />
        <p>{PaymentMethodTitleValue.zalopayTitle}</p>
      </button>
      <button className="payment-machine__main-method disabled">
        <img
          src={ImageSourcePath + PaymentMethodImageValue.visaMasterJcbLogo}
          alt={PaymentMethodImageValue.visaMasterJcbLogo}
        />
        <p>{PaymentMethodTitleValue.visMasterJcbTitle}</p>
      </button>
      <button className="payment-machine__main-method disabled">
        <img
          src={ImageSourcePath + PaymentMethodImageValue.vnpayLogo}
          alt={PaymentMethodImageValue.vnpayLogo}
        />
        <p>{PaymentMethodTitleValue.vnpayTitle}</p>
      </button>
    </div>
  );
};

export default PaymentMachineMethodsComponent;
