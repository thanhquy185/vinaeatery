import { useRef, type FC } from "react";
import type { PaymentProps } from "../../../pages/other/payment";
import type { HandlePaymentType } from "../../../common/types";
import { HandlePaymentStatus, ImageSourcePath } from "../../../common/values";
import { useEntityMutation } from "../../../hook/use-entity-mutation";
import { HandleUpdateHandlePayment } from "../../../requests/handle-payments";
import {
  HandleCreateMomoOrder,
  HandleCreateZalopayOrder,
} from "../../../requests/wallets";
import { openConfirmation } from "../../../utils/show-confirmation";

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

// Payment Methods
const PaymentMethods: FC<PaymentProps> = ({
  nameEN,
  handlePayment,
  totalFoodPrice,
  categoryTableSurcharge,
  customerDiscount,
  methodTitle,
  updateMethodInfo,
  updatePayInfo,
}) => {
  // Mutation
  const updateMutation = useEntityMutation<HandlePaymentType>({
    messages: {
      success: `Chuyển đến giao diện ${methodTitle} thành công!`,
      error: `Chuyển đến giao diện ${methodTitle} thất bại!`,
    },
    invalidateKeys: [[nameEN]],
    api: HandleUpdateHandlePayment,
  });

  // Các biến giữ ref
  const moneyButtonRef = useRef<HTMLButtonElement>(null);
  const atmButtonRef = useRef<HTMLButtonElement>(null);
  const momoButtonRef = useRef<HTMLButtonElement>(null);
  const zalopayButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="public__main-methods">
      <button
        ref={moneyButtonRef}
        className="public__main-method"
        onClick={async () => {
          if (!moneyButtonRef.current) return;

          moneyButtonRef.current.classList.add("active");

          const answer = await openConfirmation({
            title: `Thanh toán phương thức này ?`,
            content: `Bạn sắp chọn phương thức thanh toán "${moneyTitle}" để thanh toán hoá đơn.`,
          });

          if (moneyButtonRef.current) {
            if (answer) {
              const response = await updateMutation.mutateAsync({
                values: {
                  id: handlePayment?.id,
                  useTableId: handlePayment?.useTable?.id,
                  payMethodId: 1,
                  isEmployeeHandle: true,
                  isHandling: true,
                  payTotalPrice: Math.round(
                    totalFoodPrice! +
                      -1 * customerDiscount! +
                      categoryTableSurcharge!,
                  ),
                  status: HandlePaymentStatus.selected,
                },
              });
              if (response) {
                updateMethodInfo!(moneyImage, moneyTitle, null);
                updatePayInfo!(
                  "Lưu trữ nội bộ",
                  "",
                  "",
                  Date.now(),
                  Math.round(
                    totalFoodPrice! +
                      -1 * customerDiscount! +
                      categoryTableSurcharge!,
                  ),
                );
              }
            }
          }

          moneyButtonRef.current.classList.remove("active");
        }}
      >
        <img src={ImageSourcePath + moneyImage} alt="money-image" />
        <p>{moneyTitle}</p>
      </button>
      <button
        ref={momoButtonRef}
        className="public__main-method"
        onClick={async () => {
          if (!momoButtonRef.current) return;

          momoButtonRef.current.classList.add("active");

          const answer = await openConfirmation({
            title: `Thanh toán phương thức này ?`,
            content: `Bạn sắp chọn phương thức thanh toán "${momoTitle}" để thanh toán hoá đơn.`,
          });

          if (momoButtonRef.current) {
            if (answer) {
              const response = await updateMutation.mutateAsync({
                values: {
                  id: handlePayment?.id,
                  useTableId: handlePayment?.useTable?.id,
                  payMethodId: 4,
                  isEmployeeHandle: true,
                  isHandling: true,
                  payTotalPrice: Math.round(
                    totalFoodPrice! +
                      -1 * customerDiscount! +
                      categoryTableSurcharge!,
                  ),
                  status: HandlePaymentStatus.selected,
                },
              });
              if (response) {
                const momoResponse = await HandleCreateMomoOrder({
                  handlePaymentId: handlePayment?.id!,
                });
                const momoData = momoResponse.data as any;

                if (momoData) {
                  updateMethodInfo!(momoLogo, momoTitle, momoData || null);
                  updatePayInfo!(
                    momoData.orderId,
                    momoLogo,
                    momoData.qrCodeUrl,
                    momoData.responseTime,
                    momoData.amount,
                  );
                }
              }
            }
            momoButtonRef.current.classList.remove("active");
          }
        }}
      >
        <img src={ImageSourcePath + momoLogo} alt="momo-logo" />
        <p>{momoTitle}</p>
      </button>
      <button
        ref={atmButtonRef}
        className="public__main-method"
        onClick={async () => {
          if (!atmButtonRef.current) return;

          atmButtonRef.current.classList.add("active");

          const answer = await openConfirmation({
            title: `Thanh toán phương thức này ?`,
            content: `Bạn sắp chọn phương thức thanh toán "${moneyTitle}" để thanh toán hoá đơn.`,
          });

          if (atmButtonRef.current) {
            if (answer) {
              const response = await updateMutation.mutateAsync({
                values: {
                  id: handlePayment?.id,
                  useTableId: handlePayment?.useTable?.id,
                  payMethodId: 2,
                  isEmployeeHandle: true,
                  isHandling: true,
                  payTotalPrice: Math.round(
                    totalFoodPrice! +
                      -1 * customerDiscount! +
                      categoryTableSurcharge!,
                  ),
                  status: HandlePaymentStatus.selected,
                },
              });
              if (response) {
                updateMethodInfo!(atmLogo, atmTitle, "");
                updatePayInfo!(
                  "Lưu trữ nội bộ",
                  mbbankLogo,
                  atmQRCodeUrl,
                  Date.now(),
                  Math.round(
                    totalFoodPrice! +
                      -1 * customerDiscount! +
                      categoryTableSurcharge!,
                  ),
                );
              }
            }
          }

          atmButtonRef.current.classList.remove("active");
        }}
      >
        <img src={ImageSourcePath + atmLogo} alt="atm-logo" />
        <p>{atmTitle}</p>
      </button>
      <button
        ref={zalopayButtonRef}
        className="public__main-method"
        onClick={async () => {
          if (!zalopayButtonRef.current) return;

          zalopayButtonRef.current.classList.add("active");

          const answer = await openConfirmation({
            title: `Thanh toán phương thức này ?`,
            content: `Bạn sắp chọn phương thức thanh toán "${zalopayTitle}" để thanh toán hoá đơn.`,
          });

          if (zalopayButtonRef.current) {
            if (answer) {
              const response = await updateMutation.mutateAsync({
                values: {
                  id: handlePayment?.id,
                  useTableId: handlePayment?.useTable?.id,
                  payMethodId: 5,
                  isEmployeeHandle: true,
                  isHandling: true,
                  payTotalPrice: Math.round(
                    totalFoodPrice! +
                      -1 * customerDiscount! +
                      categoryTableSurcharge!,
                  ),
                  status: HandlePaymentStatus.selected,
                },
              });
              if (response) {
                const zalopayResponse = await HandleCreateZalopayOrder({
                  handlePaymentId: handlePayment?.id!,
                });
                const zalopayData = zalopayResponse.data as any;

                if (zalopayData) {
                  updateMethodInfo!(
                    zalopayLogo,
                    zalopayTitle,
                    zalopayData || null,
                  );
                  updatePayInfo!(
                    zalopayData.app_trans_id,
                    zalopayLogo,
                    zalopayData.order_url,
                    zalopayData.app_time,
                    zalopayData.amount,
                  );
                }
              }
            }
            zalopayButtonRef.current.classList.remove("active");
          }
        }}
      >
        <img src={ImageSourcePath + zalopayLogo} alt="zalopay-logo" />
        <p>{zalopayTitle}</p>
      </button>
      <button className="public__main-method disabled">
        <img
          src={ImageSourcePath + visaMasterJcbLogo}
          alt="visa-master-jcb-logo"
        />
        <p>{visMasterJcbTitle}</p>
      </button>
      <button className="public__main-method disabled">
        <img src={ImageSourcePath + vnpayLogo} alt="vnpay-logo" />
        <p>{vnpayTitle}</p>
      </button>
    </div>
  );
};

export default PaymentMethods;
