package vn.tuhoc.vinaeatery.modules.employee.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PermissionDDetailResponseDTO {
    private FunctionDetailResponseDTO function;

    private String action;
}
