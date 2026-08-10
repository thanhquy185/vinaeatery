import { Input, Select, Space } from "antd";
import type {
  ChangeEvent,
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
} from "react";

type FilterFindComponentProps = {
  // defaultValue?: string;
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

const selectBefore = ({
  selectItems,
  value,
  handleSelectChange,
}: {
  selectItems: FilterFindComponentProps["selectItems"];
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

const FilterFindComponent: FC<FilterFindComponentProps> = ({
  // defaultValue,
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
    <Space.Compact className={className}>
      {selectBefore({
        selectItems,
        value: findType!,
        handleSelectChange,
      })}

      <Input
        allowClear
        placeholder={placeholder}
        value={findValue ?? ""}
        onChange={handleInputChange}
      />
    </Space.Compact>
  );
};

export default FilterFindComponent;
