package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

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
public class ShiftDTO {
    // Properties
    private Integer id;
    private Integer restaurantId;
    private String name;
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
    private String updateAt;
    private List<ShiftDetailDTO> shiftDetails;
}
