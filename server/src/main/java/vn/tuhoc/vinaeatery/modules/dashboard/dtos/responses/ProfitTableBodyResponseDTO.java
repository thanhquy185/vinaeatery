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
public class ProfitTableBodyResponseDTO {
    private String label;

    private String start;

    private String end;

    private Long revenue;

    private Long expense;

    private Long profit;
}
