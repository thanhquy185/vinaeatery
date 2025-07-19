import { Select } from "antd";
import type { SelectProps } from "antd";
import type React from "react";

const { Option } = Select;

type CustomSelectProps = {
  allowClear?: boolean;
  id?: string;
  className?: string;
  status?: "error" | "warning" | undefined;
  placeholder?: string;
  value?: any;
  options?: { label: any; value: any }[];
  disabled?: boolean;
  setSelectValue?: (value: string | number) => void;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  allowClear = true,
  id,
  className,
  status,
  placeholder,
  value,
  disabled = false,
  options = [],
  setSelectValue,
}) => {
  const formatLabels = [
    "customer-cards",
    "customers",
    "floors",
    "category-tables",
    "tables",
    "suppliers",
    "category-ingredients",
    "category-foods",
    "rewardPunishes",
    "employees",
  ];

  return (
    <Select
      allowClear={allowClear}
      id={id}
      className={className}
      status={status}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(val) => setSelectValue?.(val)}
    >
      {options.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {formatLabels.includes(className!)
            ? "#" + opt.value + " - " + opt.label
            : opt.label}
        </Option>
      ))}
    </Select>
  );
};

export default CustomSelect;
