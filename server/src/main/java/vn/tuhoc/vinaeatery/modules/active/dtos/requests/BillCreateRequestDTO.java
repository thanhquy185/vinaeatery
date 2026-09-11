package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import java.util.List;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    @NotNull(message = "Mã nhân viên không được để trống!")
    Integer employeeId;

    @NotNull(message = "Mã khách hàng không được để trống!")
    Integer customerId;

    @NotNull(message = "Thời gian tạo đơn không được để trống!")
    String createAt;

    @NotNull(message = "Họ và tên khách hàng không được để trống!")
    String customerFullname;

    @NotNull(message = "Số điện thoại khách hàng không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    String customerPhone;

    @NotNull(message = "Email khách hàng không được để trống!")
    @Email(regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$", message = "Định dạng email không hợp lệ!")
    String customerEmail;

    @NotNull(message = "Tổng tiền món ăn không được để trống!")
    Long totalPrice;

    @NotNull(message = "Trạng thái hoá đơn không được để trống!")
    @Convert(converter = BillStatusConverter.class)
    BillStatusEnum status;

    @NotNull(message = "Mã giao dịch không được để trống!")
    String paymentId;

    @NotNull(message = "Mã phương thức thanh toán không được để trống!")
    Integer paymentMethodId;

    @NotNull(message = "Thời gian thanh toán không được để trống!")
    String paymentAt;

    @NotNull(message = "Tổng tiền thanh toán không được để trống!")
    Long paymentTotalPrice;

    @NotNull(message = "Trạng thái thanh toán không được để trống!")
    @Convert(converter = BillPaymentStatusConverter.class)
    BillPaymentStatusEnum paymentStatus;

    List<BillDetailCreateRequestDTO> billDetails;
}
