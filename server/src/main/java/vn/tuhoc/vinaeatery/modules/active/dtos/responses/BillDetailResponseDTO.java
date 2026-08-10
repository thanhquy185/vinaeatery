package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
public class BillDetailResponseDTO {
    private Integer id;

    private RestaurantSubInfoResponseDTO restaurant;

    private EmployeeSubInfoResponseDTO employee;

    private CustomerInfoResponseDTO customer;

    private String createAt;

    private String customerFullname;

    private String customerPhone;

    private String customerEmail;

    private Long totalPrice;

    @Convert(converter = BillStatusConverter.class)
    private BillStatusEnum status;

    private String paymentId;

    private PaymentMethodInfoResponseDTO paymentMethod;

    private String paymentAt;

    private Long paymentTotalPrice;

    @Convert(converter = BillPaymentStatusConverter.class)
    private BillPaymentStatusEnum paymentStatus;

    List<BillDDetailResponseDTO> billDetails;
}
