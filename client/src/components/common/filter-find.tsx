import type {
  ChangeEvent,
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
} from "react";
import { Input, Select } from "antd";

// Cấu hình kiểu cho các tham số truyền vào
type CustomFilterFindProps = {
  defaultValue?: string;
  selectItems: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  className?: string;
  findType?: string | null;
  findValue?: string | null;
  setFilterFindType: Dispatch<SetStateAction<string | null>>;
  setFilterFindValue: Dispatch<SetStateAction<string | null>>;
};

// Hàm lấy ra danh sách các thuộc tính có thể chọn để tìm kiếm
const selectBefore = ({
  selectItems,
  value,
  handleSelectChange,
}: {
  selectItems: CustomFilterFindProps["selectItems"];
  value: string | null;
  handleSelectChange: (value: string) => void;
}): ReactElement => {
  const { Option } = Select;

  return (
    <Select
      value={value ?? selectItems?.[0]?.value}
      onChange={handleSelectChange}
    >
      {selectItems.map((option, index) => (
        <Option key={index} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

// Định dạng Filter Find Input
const CustomFilterFind: FC<CustomFilterFindProps> = ({
  defaultValue,
  selectItems,
  placeholder,
  className,
  findType,
  findValue,
  setFilterFindType,
  setFilterFindValue,
}) => {
  // Hàm xử lý thay đổi "chọn" select (addon)
  const handleSelectChange = (value: string) => {
    setFilterFindType(value);
  };
  // Hàm xử lý thay đổi "nhập" input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterFindValue(e.target.value);
  };

  return (
    <>
      <Input
        allowClear
        addonBefore={selectBefore({
          selectItems,
          value: findType!,
          handleSelectChange,
        })}
        placeholder={placeholder}
        className={className}
        value={findValue ?? ""}
        onChange={handleInputChange}
      />
    </>
  );
};

export default CustomFilterFind;
