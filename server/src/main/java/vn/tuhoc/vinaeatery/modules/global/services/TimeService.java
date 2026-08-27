package vn.tuhoc.vinaeatery.modules.global.services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

@Service
public class TimeService {
    private final String DATE_FORMAT = "yyyy-MM-dd";
    private final String TIME_FORMAT = "HH:mm:ss";
    private final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    public LocalDateTime getLocalDateTime(String datetime) {
        return LocalDateTime.parse(
                datetime,
                DateTimeFormatter.ofPattern(this.DATE_TIME_FORMAT));
    }

    public String getDate(LocalDateTime localDateTime) {
        return localDateTime
                .format(DateTimeFormatter.ofPattern(this.DATE_FORMAT));
    }

    public String getTime(LocalDateTime localDateTime) {
        return localDateTime
                .format(DateTimeFormatter.ofPattern(TIME_FORMAT));
    }

    public String getDatetime(LocalDateTime localDateTime) {
        return localDateTime
                .format(DateTimeFormatter.ofPattern(this.DATE_TIME_FORMAT));
    }

    public String getCurrentDate() {
        return LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern(this.DATE_FORMAT));
    }

    public String getCurrentTime() {
        return LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern(TIME_FORMAT));
    }

    public String getCurrentDatetime() {
        return LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern(this.DATE_TIME_FORMAT));
    }
}