package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.FeedbackExperienceConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.FeedbackExperienceEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackInfoResponseDTO {
    Integer id;

    String at;

    @Convert(converter = FeedbackExperienceConverter.class)
    FeedbackExperienceEnum experience;

    Integer score1;

    Integer score2;

    Integer score3;

    Integer score4;

    Integer score5;

    String message;
}
