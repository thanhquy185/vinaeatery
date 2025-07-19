package vn.tuhoc.vinaeatery.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.stereotype.Service;

@Service
public class TimeService {

    public LocalDate getDateVN(LocalDate localDate) {
        return localDate
                .atStartOfDay(ZoneId.of("UTC")) // Tạo ZonedDateTime từ 00:00 UTC
                .withZoneSameInstant(ZoneId.of("Asia/Ho_Chi_Minh")) // Chuyển sang giờ Việt Nam
                .toLocalDate();
    }

    public LocalTime getTimeVN(LocalTime utcTime) {
        // Giả định một ngày cụ thể (ví dụ hôm nay)
        LocalDate today = LocalDate.now(ZoneId.of("UTC"));
        return ZonedDateTime.of(today, utcTime, ZoneId.of("UTC")) // Ghép LocalTime vào ngày UTC
                .withZoneSameInstant(ZoneId.of("Asia/Ho_Chi_Minh")) // Chuyển sang giờ VN
                .toLocalTime(); // Trả lại phần thời gian
    }

    public LocalDateTime getDateTimeVN(LocalDateTime localDateTime) {
        return localDateTime
                .atZone(ZoneId.of("UTC")) // Gán là UTC
                .withZoneSameInstant(ZoneId.of("Asia/Ho_Chi_Minh")) // Chuyển sang GMT+7
                .toLocalDateTime();
    }
}