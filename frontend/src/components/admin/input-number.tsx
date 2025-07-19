import { InputNumber } from "antd";
import type React from "react";
import { useRef } from "react";

// Cấu hình kiểu cho các tham số truyền vào
type CustomInputNumberProps = {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  id?: string;
  className?: string;
  value?: number;
  disabled?: boolean;
  setInputValue?: (value: number) => void;
};

const CustomInputNumber: React.FC<CustomInputNumberProps> = ({
  defaultValue,
  min,
  max,
  step,
  placeholder,
  id,
  className,
  value,
  disabled = false,
  setInputValue,
}) => {
  const inputRef = useRef<any>(null);

  const handlePressEnter = () => {
    const inputEl: HTMLInputElement | null = inputRef.current?.input;

    if (inputEl) {
      const rawValue = inputEl.value;
      const filtered = rawValue.replace(/[a-zA-Z]/g, "");

      if (filtered !== rawValue) {
        inputEl.value = filtered;
      }

      const numberValue = Number(filtered);
      if (!isNaN(numberValue)) {
        setInputValue?.(numberValue);
      }
    }
  };

  return (
    <>
      <InputNumber<number>
        ref={inputRef}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        id={id}
        className={className}
        value={value}
        disabled={disabled}
        onChange={(value) => setInputValue!(value || 0)}
        onPressEnter={handlePressEnter}
      />
    </>
  );
};

export default CustomInputNumber;
