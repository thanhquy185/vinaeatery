import { ConfigProvider, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import viVN from "antd/locale/vi_VN";

// Cấu hình hỗ trợ tiếng Việt
const vnTimezone = "Asia/Ho_Chi_Minh";
const format = "HH:mm:ss";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(vnTimezone);

// Cấu hình kiểu cho các tham số truyền vào
type CustomTimePickerProps = {
  placeholder?: string;
  id?: string;
  className?: string;
  value?: string;
  disabled?: boolean;
  setTimeValue?: (time: string) => void;
};

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  placeholder,
  id,
  className,
  value,
  disabled = false,
  setTimeValue,
}) => {
  const onChange = (time: Dayjs) => {
    if (time) {
      const vietnamTime = time.tz(vnTimezone).format(format);
      setTimeValue!(vietnamTime);
    }
  };

  return (
    <>
      <ConfigProvider locale={viVN}>
        <TimePicker
          format={format}
          placeholder={placeholder}
          id={id}
          className={className}
          value={value ? dayjs.tz(value, format, "Asia/Ho_Chi_Minh") : null}
          disabled={disabled}
          onChange={onChange}
        />
      </ConfigProvider>
    </>
  );
};

export default CustomTimePicker;
