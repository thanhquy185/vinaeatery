import { useRef } from "react";
import {
  ImageSourcePath,
  PaymentMethodImageValue,
  PaymentMethodTitleValue,
} from "../../../../constants/values";

type PaymentMethod = "money" | "momo" | "atm" | "zalopay";

type PaymentMachineMethodsComponentProps = {
  onSelectPaymentMethod: (method: PaymentMethod) => Promise<void>;
};

const PaymentMachineMethodsComponent: React.FC<
  PaymentMachineMethodsComponentProps
> = ({ onSelectPaymentMethod }) => {
  const moneyButtonRef = useRef<HTMLButtonElement>(null);
  const atmButtonRef = useRef<HTMLButtonElement>(null);
  const momoButtonRef = useRef<HTMLButtonElement>(null);
  const zalopayButtonRef = useRef<HTMLButtonElement>(null);

  const handleSelectPaymentMethod = async (
    method: PaymentMethod,
    buttonRef: React.RefObject<HTMLButtonElement | null>,
  ) => {
    if (!buttonRef.current) return;

    buttonRef.current.classList.add("active");
    await onSelectPaymentMethod(method);

    if (buttonRef.current) {
      buttonRef.current.classList.remove("active");
    }
  };

  return (
    <div className="payment-machine__main-methods">
      <button
        ref={moneyButtonRef}
        className="payment-machine__main-method"
        onClick={() => handleSelectPaymentMethod("money", moneyButtonRef)}
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
        onClick={() => handleSelectPaymentMethod("momo", momoButtonRef)}
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
        onClick={() => handleSelectPaymentMethod("atm", atmButtonRef)}
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
        onClick={() => handleSelectPaymentMethod("zalopay", zalopayButtonRef)}
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
