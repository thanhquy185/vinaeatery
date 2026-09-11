package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.ReservationStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationCustomerCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    @NotNull(message = "Mã khách hàng không được để trống!")
    Integer customerId;

    @NotNull(message = "Thời gian đặt bàn không được để trống!")
    String createAt;

    @NotNull(message = "Thời gian nhận bàn không được để trống!")
    String arriveAt;

    @NotBlank(message = "Họ và tên khách hàng không được để trống!")
    String customerFullname;

    @NotBlank(message = "Số điện thoại khách hàng không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    String customerPhone;

    @NotBlank(message = "Email khách hàng không được để trống!")
    @Email(regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$", message = "Định dạng email không hợp lệ!")
    String customerEmail;

    @NotNull(message = "Số lượng khách hàng không được để trống!")
    Integer customerGuests;

    String customerNote;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = ReservationStatusConverter.class)
    ReservationStatusEnum status;
}
