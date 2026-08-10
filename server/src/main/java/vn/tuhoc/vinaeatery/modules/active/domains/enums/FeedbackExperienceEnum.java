package vn.tuhoc.vinaeatery.modules.active.domains.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FeedbackExperienceEnum {
    TERRIBLE("TERRIBLE", "Dở tệ"),
    POOR("POOR", "Không hài lòng"),
    OKAY("OKAY", "Bình thường"),
    GOOD("GOOD", "Hài lòng"),
    PERFECT("PERFECT", "Tuyệt vời");

    private final String value;
    private final String description;

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
        for (FeedbackExperienceEnum status : values()) {
            if (status.getDescription().equalsIgnoreCase(description)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy trạng thái: " + description);
    }

    public static FeedbackExperienceEnum fromValue(String value) {
        for (FeedbackExperienceEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}