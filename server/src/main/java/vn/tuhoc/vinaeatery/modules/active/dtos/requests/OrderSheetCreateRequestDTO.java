package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import java.util.List;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.OrderSheetStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSheetCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    @NotNull(message = "Mã sử dụng bàn ăn không được để trống!")
    Integer useTableId;

    @NotNull(message = "Thời gian tạo đơn không được để trống!")
    String createAt;

    @NotNull(message = "Tổng tiền món ăn không được để trống!")
    Long totalPrice;

    String note;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = OrderSheetStatusConverter.class)
    OrderSheetStatusEnum status;

    List<OrderSheetDetailCreateRequestDTO> orderSheetDetails;
}
