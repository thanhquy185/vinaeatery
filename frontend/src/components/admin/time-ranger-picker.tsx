import { ConfigProvider, TimePicker } from "antd";
import viVN from "antd/locale/vi_VN";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type React from "react";

// Cấu hình chung
const format = "HH:mm:ss";
type NoUndefinedRangeValueType<T> = [T | null, T | null] | null;

type CustomTimeRangePickerProps = {
  showNow?: boolean;
  id?: string;
  placeholder?: [string, string];
  className?: string;
  value?: [string, string]; // dạng chuỗi
  disabled?: boolean;
  setTimeRangerValue?: (value: [string, string]) => void;
};

const CustomTimeRangePicker: React.FC<CustomTimeRangePickerProps> = ({
  showNow,
  id,
  placeholder,
  className,
  value,
  disabled = false,
  setTimeRangerValue,
}) => {
  // Chuyển value từ [string, string] sang [Dayjs, Dayjs]
  const convertedValue: NoUndefinedRangeValueType<Dayjs> = value
    ? [dayjs(value[0], format), dayjs(value[1], format)]
    : null;

  const handleTimeChange = (
    value: NoUndefinedRangeValueType<Dayjs>,
    formatted: [string, string]
  ) => {
    if (setTimeRangerValue) {
      setTimeRangerValue(formatted);
    }
  };

  return (
    <ConfigProvider locale={viVN}>
      <TimePicker.RangePicker
        format={format}
        showNow={showNow}
        id={id}
        placeholder={placeholder}
        className={className}
        value={convertedValue}
        disabled={disabled}
        onChange={handleTimeChange}
      />
    </ConfigProvider>
  );
};

export default CustomTimeRangePicker;
