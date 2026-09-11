package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
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
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseTableDetailResponseDTO {
    Long id;

    RestaurantSubInfoResponseDTO restaurant;

    PaymentMachineInfoResponseDTO paymentMachine;

    FeedbackInfoResponseDTO feedback;

    MenuInfoResponseDTO menu;

    MessageInfoResponseDTO message;

    BillInfoResponseDTO bill;

    ReservationInfoResponseDTO reservation;

    TableInfoResponseDTO table;

    EmployeeSubInfoResponseDTO employee;

    CustomerInfoResponseDTO customer;

    String startAt;

    String endAt;

    String customerFullname;

    String customerPhone;

    String customerEmail;

    Integer customerAdult;

    Integer customerChild;

    Integer customerGuests;

    @Convert(converter = UseTableStatusConverter.class)
    UseTableStatusEnum status;

    List<OrderSheetInfoResponseDTO> orderSheets;
}
