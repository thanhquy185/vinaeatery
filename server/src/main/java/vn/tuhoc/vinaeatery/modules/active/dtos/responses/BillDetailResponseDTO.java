package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMethodInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillDetailResponseDTO {
    Integer id;

    RestaurantSubInfoResponseDTO restaurant;

    EmployeeSubInfoResponseDTO employee;

    CustomerInfoResponseDTO customer;

    String createAt;

    String customerFullname;

    String customerPhone;

    String customerEmail;

    Long totalPrice;

    @Convert(converter = BillStatusConverter.class)
    BillStatusEnum status;

    String paymentId;

    PaymentMethodInfoResponseDTO paymentMethod;

    String paymentAt;

    Long paymentTotalPrice;

    @Convert(converter = BillPaymentStatusConverter.class)
    BillPaymentStatusEnum paymentStatus;

    List<BillDDetailResponseDTO> billDetails;
}
