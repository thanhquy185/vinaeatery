package vn.tuhoc.vinaeatery.modules.dashboard.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum TimelineEnum {
    YEAR("YEAR", "Theo năm"),
    QUARTER("QUARTER", "Theo quý"),
    MONTH("MONTH", "Theo tháng");

    final String value;
    final String description;

    TimelineEnum(String value, String description) {
        this.value = value;
        this.description = description;
    }

    public String getValue() {
        return value;
    }

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