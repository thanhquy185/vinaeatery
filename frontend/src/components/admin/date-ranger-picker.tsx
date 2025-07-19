import { ConfigProvider, DatePicker } from "antd";
import type React from "react";
import viVN from "antd/locale/vi_VN";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

// Cấu hình định dạng ngày tháng
const formatDate = "YYYY-MM-DD";
const formatDatetime = "YYYY-MM-DD HH:mm:ss";
type NoUndefinedRangeValueType<T> = [T | null, T | null] | null;

// Kiểu dữ liệu cho props truyền vào
type CustomDateRangePickerProps = {
  showTime?: boolean; // Nếu muốn kèm thời gian
  placeholder?: [string, string];
  className?: string;
  setDateRangeValue?: (value: [string, string]) => void;
};

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  showTime = false,
  placeholder,
  className,
  setDateRangeValue,
}) => {
  const handleDateChange = (
    value: NoUndefinedRangeValueType<Dayjs>,
    formatted: [string, string]
  ) => {
    if (setDateRangeValue) {
      setDateRangeValue(formatted);
    }
  };

  return (
    <ConfigProvider locale={viVN}>
      <RangePicker
        format={showTime ? formatDatetime : formatDate}
        showTime={showTime}
        placeholder={placeholder}
        className={className}
        onChange={handleDateChange}
      />
    </ConfigProvider>
  );
};

export default CustomDateRangePicker;
