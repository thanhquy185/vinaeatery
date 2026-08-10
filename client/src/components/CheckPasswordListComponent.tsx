import type { FC } from "react";
import { Check, X } from "lucide-react";
import { rulePasswordStrong } from "../constants/rules";

type CheckPasswordListComponentProps = {
  password: string;
};

const CheckPasswordListComponent: FC<CheckPasswordListComponentProps> = ({
  password,
}) => {
  const checks = rulePasswordStrong(password);

  const Item = ({ valid, text }: { valid: boolean; text: string }) => (
    <p className={valid ? "green" : "red"}>
      {valid ? <Check /> : <X />}
      <span>{text}</span>
    </p>
  );

  return (
    <div className="check-password">
      <Item valid={checks.length} text="Ít nhất 8 ký tự" />
      <Item valid={checks.upper} text="Có chữ hoa" />
      <Item valid={checks.lower} text="Có chữ thường" />
      <Item valid={checks.number} text="Có số" />
      <Item valid={checks.special} text="Có ký tự đặc biệt" />
    </div>
  );
};

export default CheckPasswordListComponent;
