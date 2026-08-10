import { ImageSourcePath } from "../../../constants/values";
import type { PaymentMachinePageProps } from "../../../constants/props";

const PaymentMachineInformComponent: React.FC<
  PaymentMachinePageProps
> = ({}) => {
  return (
    <div className="public__inform">
      <img src={ImageSourcePath + "checked-icon.png"} alt="check-icon" />
      <h1>Hoàn tất thanh toán hoá đơn !</h1>
      <p>
        Cảm ơn bạn đã thưởng thức món ăn cùng chúng tôi. Hẹn gặp lại bạn sớm !
      </p>
    </div>
  );
};

export default PaymentMachineInformComponent;
