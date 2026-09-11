package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.OrderSheetStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSheetInfoResponseDTO {
    Integer id;

    String createAt;

    String serviceAt;

    String cancelAt;

    Long totalPrice;

    String note;

    String message;

    @Convert(converter = OrderSheetStatusConverter.class)
    OrderSheetStatusEnum status;

    List<OrderSheetDDetailResponseDTO> orderSheetDetails;
}
