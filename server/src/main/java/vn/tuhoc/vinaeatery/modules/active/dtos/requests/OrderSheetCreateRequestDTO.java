package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import java.util.List;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.OrderSheetStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;

@Data
public class OrderSheetCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;

    @NotNull(message = "Mã sử dụng bàn ăn không được để trống!")
    private Integer useTableId;

    @NotNull(message = "Thời gian tạo đơn không được để trống!")
    private String createAt;

    @NotNull(message = "Tổng tiền món ăn không được để trống!")
    private Long totalPrice;

    private String note;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = OrderSheetStatusConverter.class)
    private OrderSheetStatusEnum status;

    List<OrderSheetDetailCreateRequestDTO> orderSheetDetails;
}
