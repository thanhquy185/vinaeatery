package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.OrderSheetStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSheetDetailResponseDTO {
    Integer id;

    RestaurantSubInfoResponseDTO restaurant;

    UseTableInfoResponseDTO useTable;

    EmployeeSubInfoResponseDTO employee;

    String createAt;

    String serviceAt;

    String cancelAt;

    Long totalPrice;

    String note;

    String message;

    @Convert(converter = OrderSheetStatusConverter.class)
    OrderSheetStatusEnum status;

    List<OrderSheetDDetailResponseDTO> orderSheetDetails;
}
