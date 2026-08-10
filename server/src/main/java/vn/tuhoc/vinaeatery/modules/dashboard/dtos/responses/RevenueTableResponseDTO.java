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
public class RevenueTableResponseDTO {
    private List<RevenueBillTableBodyResponseDTO> billTableBody;

    private RevenueBillTableFootResponseDTO billTableFoot;

    private List<RevenueFoodTableBodyResponseDTO> foodTableBody;

    private RevenueFoodTableFootResponseDTO foodTableFoot;

    private List<RevenueTableTableBodyResponseDTO> tableTableBody;

    private RevenueTableTableFootResponseDTO tableTableFoot;
}
