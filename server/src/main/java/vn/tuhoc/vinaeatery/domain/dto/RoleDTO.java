package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleDTO {
    // Properties
    private Integer id;
    private Integer restaurantId;
    private String name;
    private String salaryType;
    private Long salaryValue;
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
}
