import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Kích hoạt plugin
dayjs.extend(utc);
dayjs.extend(timezone);

// Múi giờ Việt Nam
const VietnamTimezone = "Asia/Ho_Chi_Minh";

export function getVietnamCurrentDate() {
  return dayjs().tz(VietnamTimezone).format("YYYY-MM-DD");
}

export function getVietnamCurrentTime() {
  return dayjs().tz(VietnamTimezone).format("HH:mm:ss");
}

export function getVietnamCurrentDatetime() {
  return dayjs().tz(VietnamTimezone).format("YYYY-MM-DD HH:mm:ss");
}

export function getCurrentTimes(timezone: string, format: string) {
  return dayjs().tz(timezone).format(format);
}
