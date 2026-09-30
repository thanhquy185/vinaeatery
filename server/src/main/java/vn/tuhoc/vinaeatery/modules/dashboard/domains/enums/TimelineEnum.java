package vn.tuhoc.vinaeatery.modules.dashboard.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum TimelineEnum {
    YEAR("YEAR", "Theo năm"),
    QUARTER("QUARTER", "Theo quý"),
    MONTH("MONTH", "Theo tháng");

    String value;
    String description;

    @JsonValue
    public String getDescription() {
        return description;
    }

    @JsonCreator
    public static TimelineEnum fromDescription(String description) {
        for (TimelineEnum timeline : values()) {
            if (timeline.getDescription().equalsIgnoreCase(description)) {
                return timeline;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static TimelineEnum fromValue(String value) {
        for (TimelineEnum timeline : values()) {
            if (timeline.getValue().equals(value)) {
                return timeline;
            }
        }
        throw new IllegalArgumentException("Invalid timeline: " + value);
    }
}