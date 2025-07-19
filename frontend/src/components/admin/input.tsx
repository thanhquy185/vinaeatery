import { Input } from "antd";
import type { ReactNode } from "react";
import type React from "react";

// Cấu hình kiểu cho các tham số truyền vào
type CustomInputProps = {
  id?: string;
  className?: string;
  status?: "warning" | "error" | undefined;
  prefix?: ReactNode;
  suffix?: ReactNode;
  placeholder?: string;
  value?: any;
  disabled?: boolean;
  setInputValue?: (value: any) => void;
};

const CustomInput: React.FC<CustomInputProps> = ({
  id,
  className,
  status,
  placeholder,
  value,
  disabled = false,
  setInputValue,
}) => {
  return (
    <>
      <Input
        id={id}
        className={className}
        status={status}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => setInputValue?.(e.target.value)}
      />
    </>
  );
};

export default CustomInput;
