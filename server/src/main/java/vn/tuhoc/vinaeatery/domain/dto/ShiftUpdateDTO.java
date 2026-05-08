package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.ShiftDetailForCrud;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ShiftUpdateDTO {
    // Properties
    @NotNull(message = "Tên ca làm không được để trống!")
    private String name;
    private List<ShiftDetailForCrud> shiftDetails;
}
