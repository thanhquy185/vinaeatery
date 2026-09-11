package vn.tuhoc.vinaeatery.modules.active.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public enum FeedbackExperienceEnum {
    TERRIBLE("TERRIBLE", "Dở tệ"),
    POOR("POOR", "Không hài lòng"),
    OKAY("OKAY", "Bình thường"),
    GOOD("GOOD", "Hài lòng"),
    PERFECT("PERFECT", "Tuyệt vời");

    final String value;
    final String description;

    FeedbackExperienceEnum(String value, String description) {
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
    public static FeedbackExperienceEnum fromDescription(String description) {
        for (FeedbackExperienceEnum experience : values()) {
            if (experience.getDescription().equalsIgnoreCase(description)) {
                return experience;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static FeedbackExperienceEnum fromValue(String value) {
        for (FeedbackExperienceEnum experience : values()) {
            if (experience.getValue().equals(value)) {
                return experience;
            }
        }
        throw new IllegalArgumentException("Invalid experience: " + value);
    }
}