package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.FeedbackExperienceConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.FeedbackExperienceEnum;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    @NotNull(message = "Mã khách hàng không được để trống!")
    Integer customerId;

    @NotNull(message = "Thời gian không được để trống!")
    String at;

    @NotNull(message = "Trải nghiệm không được để trống!")
    @Convert(converter = FeedbackExperienceConverter.class)
    FeedbackExperienceEnum experience;

    @NotNull(message = "Điểm đánh giá 1 không được để trống!")
    Integer score1;

    @NotNull(message = "Điểm đánh giá 2 không được để trống!")
    Integer score2;

    @NotNull(message = "Điểm đánh giá 3 không được để trống!")
    Integer score3;

    @NotNull(message = "Điểm đánh giá 4 không được để trống!")
    Integer score4;

    @NotNull(message = "Điểm đánh giá 5 không được để trống!")
    Integer score5;

    @NotBlank(message = "Góp ý không được để trống!")
    String message;
}
