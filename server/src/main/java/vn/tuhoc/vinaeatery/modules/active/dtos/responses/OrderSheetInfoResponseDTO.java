package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.OrderSheetStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderSheetInfoResponseDTO {
    private Integer id;

    private String createAt;

    private String serviceAt;

    private String cancelAt;

    private Long totalPrice;

    private String note;

    private String message;

    @Convert(converter = OrderSheetStatusConverter.class)
    private OrderSheetStatusEnum status;

    List<OrderSheetDDetailResponseDTO> orderSheetDetails;
}
