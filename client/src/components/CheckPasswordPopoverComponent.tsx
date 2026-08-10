import { Popover } from "antd";
import { Check, X } from "lucide-react";
import { rulePasswordStrong } from "../constants/rules";

type CheckPasswordPopoverComponentProps = {
  password: string;
  children: React.ReactNode;
};

const CheckPasswordPopoverComponent: React.FC<
  CheckPasswordPopoverComponentProps
> = ({ password, children }) => {
  return (
    <Popover
      placement="bottom"
      trigger="focus"
      content={() => {
        const checks = rulePasswordStrong(password);

        const Item = ({
          valid,
          children,
        }: {
          valid: boolean;
          children: React.ReactNode;
        }) => (
          <p className={valid ? "green" : "red"}>
            {valid ? <Check /> : <X />}
            <span>{children}</span>
          </p>
        );

        return (
          <div className="check-password">
            <Item valid={checks.length}>Ít nhất 8 ký tự</Item>
            <Item valid={checks.upper}>Có chữ hoa</Item>
            <Item valid={checks.lower}>Có chữ thường</Item>
            <Item valid={checks.number}>Có số</Item>
            <Item valid={checks.special}>Có ký tự đặc biệt</Item>
          </div>
        );
      }}
    >
      {children}
    </Popover>
  );
};

export default CheckPasswordPopoverComponent;
