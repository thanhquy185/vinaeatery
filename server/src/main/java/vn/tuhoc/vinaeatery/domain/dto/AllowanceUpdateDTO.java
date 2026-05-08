package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.AllowanceDetailForCrud;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AllowanceUpdateDTO {
    // Properties
    @NotNull(message = "Tên phụ cấp không được để trống!")
    private String name;
    @NotNull(message = "Tháng không được để trống!")
    private String month;
    private String note;
    private List<AllowanceDetailForCrud> allowanceDetails;
}
