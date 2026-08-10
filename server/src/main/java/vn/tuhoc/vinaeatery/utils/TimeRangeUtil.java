package vn.tuhoc.vinaeatery.utils;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import vn.tuhoc.vinaeatery.modules.dashboard.domains.enums.TimelineEnum;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.TimeRangeResponseDTO;

@Service
public class TimeRangeUtil {
    private static List<TimeRangeResponseDTO> getWeeksInMonth(int year, int month) {
        List<TimeRangeResponseDTO> weeks = new ArrayList<>();

        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = YearMonth.of(year, month).atEndOfMonth();

        LocalDate current = firstDay;

        int week = 1;

        while (!current.isAfter(lastDay)) {
            LocalDate start = current;
            LocalDate end = current.plusDays(6);

            if (end.isAfter(lastDay)) {
                end = lastDay;
            }

            weeks.add(TimeRangeResponseDTO.builder()
                    .label(String.format("Tuần %s", week++))
                    .start(start.toString())
                    .end(end.toString())
                    .build());

            current = current.plusWeeks(1);
        }

        return weeks;
    }

    private static List<TimeRangeResponseDTO> getWeeksInQuarter(int year, int quarter) {
        List<TimeRangeResponseDTO> weeks = new ArrayList<>();

        int startMonth = (quarter - 1) * 3 + 1;
        int endMonth = startMonth + 2;

        LocalDate firstDay = LocalDate.of(year, startMonth, 1);
        LocalDate lastDay = YearMonth.of(year, endMonth).atEndOfMonth();

        LocalDate current = firstDay;

        int week = 1;

        while (!current.isAfter(lastDay)) {
            LocalDate start = current;
            LocalDate end = current.plusDays(6);

            if (end.isAfter(lastDay)) {
                end = lastDay;
            }

            weeks.add(TimeRangeResponseDTO.builder()
                    .label(String.format("Tuần %s", week++))
                    .start(start.toString())
                    .end(end.toString())
                    .build());

            current = current.plusWeeks(1);
        }

        return weeks;
    }

    private static List<TimeRangeResponseDTO> getMonthsInYear(int year) {
        List<TimeRangeResponseDTO> months = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            LocalDate start = LocalDate.of(year, month, 1);
            LocalDate end = YearMonth.of(year, month).atEndOfMonth();

            months.add(TimeRangeResponseDTO.builder()
                    .label(String.format("Tháng %s", month))
                    .start(start.toString())
                    .end(end.toString())
                    .build());
        }

        return months;
    }

    public static List<TimeRangeResponseDTO> getTimeRanges(TimelineEnum timeline, String timeDetail) {
        return switch (timeline) {
            // Năm yyyy
            case YEAR -> {
                int year = Integer.parseInt(timeDetail.replaceAll("\\D+", ""));

                yield getMonthsInYear(year);
            }
            // Quý mm/yyyy
            case QUARTER -> {
                String[] split = timeDetail.split("/");

                int quarter = Integer.parseInt(split[0].replaceAll("\\D+", ""));
                int year = Integer.parseInt(split[1]);

                yield getWeeksInQuarter(year, quarter);
            }
            // Tháng mm/yyyy
            case MONTH -> {
                String[] split = timeDetail.split("/");

                int month = Integer.parseInt(split[0].replaceAll("\\D+", ""));
                int year = Integer.parseInt(split[1]);

                yield getWeeksInMonth(year, month);
            }

        };

    }
}
