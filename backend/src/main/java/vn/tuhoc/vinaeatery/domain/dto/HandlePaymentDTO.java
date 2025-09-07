package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.PayMethod;
import vn.tuhoc.vinaeatery.domain.enumm.HandlePaymentStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.HandlePaymentStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class HandlePaymentDTO {
    // Properties
    private Integer id;
    private UseTableDTO useTable;
    private EmployeeDTO employee;
    private PayMethod payMethod;
    private Long payTotalPrice;
    @Convert(converter = HandlePaymentStatusConverter.class)
    private HandlePaymentStatusEnum status;
}
