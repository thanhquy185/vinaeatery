import { ConfigProvider, DatePicker, type DatePickerProps } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import type React from "react";

// Cấu hình hỗ trợ tiếng Việt
dayjs.locale("vi");

// Cấu hình định dạng ngày tháng
const formatDate = "YYYY-MM-DD";
const formatDatetime = "YYYY-MM-DD HH:mm:ss";

// Cấu hình kiểu cho các tham số truyền vào
type CustomDatePickerProps = {
  showTime?: boolean;
  id?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  setDatePickerValue?: (dateString: string | string[]) => void;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  showTime,
  id,
  className,
  placeholder,
  value,
  disabled = false,
  setDatePickerValue,
}) => {
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    // console.log(date, dateString);
    setDatePickerValue!(dateString);
  };

  return (
    <>
      <ConfigProvider locale={viVN}>
        <DatePicker
          format={showTime ? formatDatetime : formatDate}
          showTime={showTime}
          id={id}
          className={className}
          placeholder={placeholder}
          value={value ? dayjs(value) : null}
          disabled={disabled}
          onChange={onChange}
        />
      </ConfigProvider>
    </>
  );
};

export default CustomDatePicker;
