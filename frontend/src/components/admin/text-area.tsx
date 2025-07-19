import TextArea from "antd/es/input/TextArea";
import type React from "react";

// Cấu hình kiểu cho các tham số truyền vào
type CustomTextAreaProps = {
  rows?: number;
  columns?: number;
  placeholder?: string;
  id?: string;
  className?: string;
  value?: string;
  disabled?: boolean;
  setTextAreaValue?: (value: string) => void;
};

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  rows,
  columns,
  placeholder,
  id,
  className,
  value,
  disabled = false,
  setTextAreaValue,
}) => {
  return (
    <>
      <TextArea
        rows={rows}
        maxLength={columns}
        placeholder={placeholder}
        id={id}
        className={className}
        value={value}
        disabled={disabled}
        onChange={(e) => setTextAreaValue?.(e.target.value)}
      />
    </>
  );
};

export default CustomTextArea;
