package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import java.util.List;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InputTicketCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    @NotNull(message = "Mã nhân viên không được để trống!")
    Integer employeeId;

    @NotNull(message = "Mã nhà cung cấp không được để trống!")
    Integer supplierId;

    @NotNull(message = "Thời gian tạo phiếu không được để trống!")
    String createAt;

    @NotNull(message = "Tổng tiền nguyên liệu không được để trống!")
    Long totalInputPrice;

    @NotNull(message = "Trạng thái thanh toán không được để trống!")
    @Convert(converter = InputTicketPaymentStatusConverter.class)
    InputTicketPaymentStatusEnum paymentStatus;

    @NotNull(message = "Trạng thái phiếu nhập không được để trống!")
    @Convert(converter = InputTicketStatusConverter.class)
    InputTicketStatusEnum status;

    List<InputTicketDetailCreateRequestDTO> inputTicketDetails;
}
