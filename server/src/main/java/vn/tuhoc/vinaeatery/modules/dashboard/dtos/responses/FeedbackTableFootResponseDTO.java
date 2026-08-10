package vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FeedbackTableFootResponseDTO {
    private Integer totalScore1;

    private Integer totalScore2;

    private Integer totalScore3;

    private Integer totalScore4;

    private Integer totalScore5;
}
