package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.ReservationStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum;

@Data
public class ReservationCustomerCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;

    @NotNull(message = "Mã khách hàng không được để trống!")
    private Integer customerId;

    @NotNull(message = "Thời gian đặt bàn không được để trống!")
    private String createAt;

    @NotNull(message = "Thời gian nhận bàn không được để trống!")
    private String arriveAt;

    @NotBlank(message = "Họ và tên khách hàng không được để trống!")
    private String customerFullname;

    @NotBlank(message = "Số điện thoại khách hàng không được để trống!")
    @Pattern(regexp = "^(\\d{10}|\\d{11})$", message = "Số điện thoại chỉ chứa chữ số và có 10 hoặc 11 số!")
    private String customerPhone;

    @NotBlank(message = "Email khách hàng không được để trống!")
    @Email(regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$", message = "Định dạng email không hợp lệ!")
    private String customerEmail;

    @NotNull(message = "Số lượng khách hàng không được để trống!")
    private Integer customerGuests;

    private String customerNote;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = ReservationStatusConverter.class)
    private ReservationStatusEnum status;
}
