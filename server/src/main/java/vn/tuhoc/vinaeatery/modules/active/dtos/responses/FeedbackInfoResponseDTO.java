package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.FeedbackExperienceConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.FeedbackExperienceEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FeedbackInfoResponseDTO {
    private Integer id;

    private String at;

    @Convert(converter = FeedbackExperienceConverter.class)
    private FeedbackExperienceEnum experience;

    private Integer score1;

    private Integer score2;

    private Integer score3;

    private Integer score4;

    private Integer score5;

    private String message;
}
