package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.OrderSheetStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderSheetDetailResponseDTO {
    private Integer id;

    private RestaurantSubInfoResponseDTO restaurant;

    private UseTableInfoResponseDTO useTable;

    private EmployeeSubInfoResponseDTO employee;

    private String createAt;

    private String serviceAt;

    private String cancelAt;

    private Long totalPrice;

    private String note;

    private String message;

    @Convert(converter = OrderSheetStatusConverter.class)
    private OrderSheetStatusEnum status;

    List<OrderSheetDDetailResponseDTO> orderSheetDetails;
}
