package vn.tuhoc.vinaeatery.modules.food.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SupplierCrudResponseDTO {
    private Integer id;

    private String fullname;

    private String phone;

    private String email;

    private String houseNumber;

    private String streetName;

    private String ward;

    private String province;
}
