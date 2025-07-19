import { Select, type SelectProps } from "antd";
import type { Dispatch, SetStateAction } from "react";

// Cấu hình kiểu cho các tham số truyền vào
type CustomFindSelectProps = {
  mode: "multiple" | "tags" | undefined;
  placeholder?: string;
  optionFilterProp: string;
  maxTagCount: number | "responsive" | undefined;
  options: SelectProps["options"];
  className?: string;
  setFilterSelectValue: Dispatch<SetStateAction<string[] | null>>;
};

// Định dạng Filter Find Select
const CustomFindSelect: React.FC<CustomFindSelectProps> = ({
  mode,
  placeholder,
  optionFilterProp,
  maxTagCount,
  options,
  className,
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
        placeholder={placeholder}
        optionFilterProp={optionFilterProp}
        maxTagCount={maxTagCount}
        options={options}
        className={className}
        labelInValue
        onChange={handleChange}
      />
    </>
  );
};

export default CustomFindSelect;
