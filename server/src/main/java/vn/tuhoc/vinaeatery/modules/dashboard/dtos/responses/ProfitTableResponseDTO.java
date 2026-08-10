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
public class ProfitTableResponseDTO {
    private List<ProfitTableBodyResponseDTO> body;

    private ProfitTableFootResponseDTO foot;
}
