package vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses;

import java.util.List;

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
public class ProfitLineChartResponseDTO {
    private List<Long> revenueLine;

    private List<Long> expenseLine;

    private List<Long> profitLine;

    private List<String> xLabels;
}
