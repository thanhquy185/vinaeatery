package vn.tuhoc.vinaeatery.modules.employee.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FunctionSummaryResponseDTO {
    private Integer id;

    private String nameVN;

    private String nameEN;

    private String category;

    private String actions;
}
