package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FeedbackExperienceCrudResponseDTO {
    private String id;

    private String image;

    private String name;

    private Integer index;
}
