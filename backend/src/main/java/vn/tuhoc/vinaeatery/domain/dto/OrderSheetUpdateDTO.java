package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.OrderSheetStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderSheetUpdateDTO {
    // Properties
    private LocalDateTime serviceAt;
    private Integer employeeId;
    private String message;
    @Convert(converter = OrderSheetStatusConverter.class)
    private OrderSheetStatusEnum status;
}