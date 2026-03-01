import type { Dispatch, FC, SetStateAction } from "react";
import { Select, type SelectProps } from "antd";

// Cấu hình kiểu cho các tham số truyền vào
type CustomFilterSelectProps = {
  mode: "multiple" | "tags" | undefined;
  placeholder?: string;
  defaultValue?:
    | { label: string; value: string }
    | { label: string; value: string }[]
    | null
    | undefined;
  optionFilterProp: string;
  maxTagCount: number | "responsive" | undefined;
  options: SelectProps["options"];
  className?: string;
  filterSelectValue?:
    | { label: string; value: string }
    | { label: string; value: string }[]
    | null
    | undefined;
  setFilterSelectValue: Dispatch<SetStateAction<string[] | null>>;
};

// Định dạng Filter Find Select
const CustomFilterSelect: FC<CustomFilterSelectProps> = ({
  mode,
  placeholder,
  defaultValue,
  optionFilterProp,
  maxTagCount,
  options,
  className,
  filterSelectValue,
  setFilterSelectValue,
}) => {
  // Hàm xử lý thay đổi khi chọn
  const handleChange = (
    value: { label: string; value: string } | { label: string; value: string }[]
  ) => {
    if (Array.isArray(value)) {
      const extracted = value.map((v) => v.value);
      setFilterSelectValue(extracted);
    } else if (value) {
      setFilterSelectValue([value.value]); // bọc thành mảng
    } else {
      setFilterSelectValue(null);
    }
  };

  return (
    <>
      <Select
        mode={mode}
        showSearch
        allowClear
        labelInValue
        defaultValue={defaultValue}
        placeholder={placeholder}
        optionFilterProp={optionFilterProp}
        maxTagCount={maxTagCount}
        options={options}
        className={className}
        value={filterSelectValue}
        onChange={handleChange}
      />
    </>
  );
};

export default CustomFilterSelect;
