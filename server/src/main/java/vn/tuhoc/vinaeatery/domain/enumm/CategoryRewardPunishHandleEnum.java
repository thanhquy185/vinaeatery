package vn.tuhoc.vinaeatery.domain.enumm;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoryRewardPunishHandleEnum {
    // Enums
    REWARD("REWARD", "Thưởng"),
    PUNISH("PUNISH", "Phạt");

    // Properties
    private final String value;
    private final String description;

    // Constructors
    CategoryRewardPunishHandleEnum(String value, String description) {
        this.value = value;
        this.description = description;
    }

    // Methods
    public String getValue() {
        return value;
    }

    @JsonValue
    public String getDescription() {
        return description;
    }

    public static CategoryRewardPunishHandleEnum fromValue(String value) {
        for (CategoryRewardPunishHandleEnum status : values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value);
    }
}