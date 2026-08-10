package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseTableStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UseTableDetailResponseDTO {
    private Long id;

    private RestaurantSubInfoResponseDTO restaurant;

    private PaymentMachineInfoResponseDTO paymentMachine;

    private FeedbackInfoResponseDTO feedback;

    private MenuInfoResponseDTO menu;

    private MessageInfoResponseDTO message;

    private BillInfoResponseDTO bill;

    private ReservationInfoResponseDTO reservation;

    private TableInfoResponseDTO table;

    private EmployeeSubInfoResponseDTO employee;

    private CustomerInfoResponseDTO customer;

    private String startAt;

    private String endAt;

    private String customerFullname;

    private String customerPhone;

    private String customerEmail;

    private Integer customerAdult;

    private Integer customerChild;

    private Integer customerGuests;

    @Convert(converter = UseTableStatusConverter.class)
    private UseTableStatusEnum status;

    private List<OrderSheetInfoResponseDTO> orderSheets;
}
