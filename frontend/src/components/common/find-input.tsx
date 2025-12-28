import { Input, Select } from "antd";
import type { Dispatch, ReactElement, SetStateAction } from "react";

// Cấu hình kiểu cho các tham số truyền vào
type CustomFindInputProps = {
  selectItems: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  setFilterFindType: Dispatch<SetStateAction<string | null>>;
  setFilterFindValue: Dispatch<SetStateAction<string | null>>;
};

// Hàm lấy ra danh sách các thuộc tính có thể chọn để tìm kiếm
const selectBefore = ({
  selectItems,
  handleSelectChange,
}: {
  selectItems: CustomFindInputProps["selectItems"];
  handleSelectChange: (value: string) => void;
}): ReactElement => {
  const { Option } = Select;

  return (
    <>
      <Select
        defaultValue={selectItems?.[0]?.value}
        onChange={handleSelectChange}
      >
        {selectItems?.map((option, index) => (
          <Option key={index} value={option?.value}>{option?.label}</Option>
        ))}
      </Select>
    </>
  );
};

// Định dạng Filter Find Input
const CustomFindInput: React.FC<CustomFindInputProps> = ({
  selectItems,
  placeholder,
  defaultValue,
  className,
  setFilterFindType,
  setFilterFindValue,
}) => {
  // Hàm xử lý thay đổi "chọn" select (addon)
  const handleSelectChange = (value: string) => {
    setFilterFindType(value);
  };
  // Hàm xử lý thay đổi "nhập" input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFindValue(e.target.value);
  };

  return (
    <>
      <Input
        addonBefore={selectBefore({ selectItems, handleSelectChange })}
        allowClear={true}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={className}
        onChange={handleInputChange}
      />
    </>
  );
};

export default CustomFindInput;
