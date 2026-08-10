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
public class PieChartResponseDTO {
    private Integer id;

    private String label;

    private Long value;
}
