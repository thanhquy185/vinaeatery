import { useRef } from "react";
import { PaymentMachineProcessStatusValue } from "../../../../constants/values";
import type { PaymentMachineDetailResponseType } from "../../../../types/PaymentMachineType";

type PaymentMachineActionsComponentProps = {
  current: number;
  processStatus: PaymentMachineDetailResponseType["processStatus"];
  onNext: () => void;
  onPrevious: () => void;
  onChangePaymentMethod: () => Promise<void>;
  onCompletePayment: () => Promise<boolean>;
};

const PaymentMachineActionsComponent: React.FC<
  PaymentMachineActionsComponentProps
> = ({
  current,
  processStatus,
  onNext,
  onPrevious,
  onChangePaymentMethod,
  onCompletePayment,
}) => {
  const changePaymentMethodButtonRef = useRef<HTMLButtonElement>(null);
  const completedPaymentButtonRef = useRef<HTMLButtonElement>(null);

  const handleAction = async (
    buttonRef: React.RefObject<HTMLButtonElement | null>,
    action: () => Promise<void | boolean>,
  ) => {
    if (!buttonRef.current) return;

    buttonRef.current.classList.add("active");
    const shouldRemoveActive = await action();

    if (buttonRef.current && shouldRemoveActive !== false) {
      buttonRef.current.classList.remove("active");
    }
  };

  return (
    <div className="payment-machine__main-buttons">
      {current === 0 &&
        processStatus === PaymentMachineProcessStatusValue.pending && (
          <button className="btn right" onClick={onNext}>
            Tiếp tục
          </button>
        )}
      {current === 1 &&
        processStatus === PaymentMachineProcessStatusValue.pending && (
          <button className="btn" onClick={onPrevious}>
            Quay lại
          </button>
        )}
      {current === 1 &&
        processStatus === PaymentMachineProcessStatusValue.selected && (
          <button
            ref={changePaymentMethodButtonRef}
            className="btn"
            onClick={() =>
              handleAction(
                changePaymentMethodButtonRef,
                onChangePaymentMethod,
              )
            }
          >
            Đổi phương thức
          </button>
        )}
      {current === 2 &&
        processStatus === PaymentMachineProcessStatusValue.feedback && (
          <button
            ref={completedPaymentButtonRef}
            className="btn center"
            onClick={() =>
              handleAction(completedPaymentButtonRef, onCompletePayment)
            }
          >
            Hoàn tất
          </button>
        )}
    </div>
  );
};

export default PaymentMachineActionsComponent;
