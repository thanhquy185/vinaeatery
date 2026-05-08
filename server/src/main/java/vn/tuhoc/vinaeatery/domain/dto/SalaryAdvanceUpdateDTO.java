package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.SalaryAdvanceStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.SalaryAdvanceStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SalaryAdvanceUpdateDTO {
    // Properties
    @Convert(converter = SalaryAdvanceStatusConverter.class)
    private SalaryAdvanceStatusEnum status;
}