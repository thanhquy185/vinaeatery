package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.HandlePaymentStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.HandlePaymentStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HandlePaymentUpdateDTO {
    // Properties
    private Long useTableId;
    private Integer employeeId;
    private Integer payMethodId;
    private Boolean isEmployeeHandle;
    private Long payTotalPrice;
    @Convert(converter = HandlePaymentStatusConverter.class)
    private HandlePaymentStatusEnum status;
}
