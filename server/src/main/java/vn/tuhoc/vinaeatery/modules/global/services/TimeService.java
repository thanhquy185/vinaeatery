package vn.tuhoc.vinaeatery.modules.global.services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

@Service
public class TimeService {
    public String getDate(LocalDateTime localDateTime) {
        return localDateTime
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    public String getTime(LocalDateTime localDateTime) {
        return localDateTime
                .format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    public String getDatetime(LocalDateTime localDateTime) {
        return localDateTime
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public String getCurrentDate() {
        return LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyy-MM-dd"));
    }

    public String getCurrentTime() {
        return LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    public String getCurrentDatetime() {
        return LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}