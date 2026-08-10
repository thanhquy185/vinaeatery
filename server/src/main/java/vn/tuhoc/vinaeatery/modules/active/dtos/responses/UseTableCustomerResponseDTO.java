package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseTableStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UseTableCustomerResponseDTO {
    private Long id;

    private RestaurantSubInfoResponseDTO restaurant;

    private MenuCustomerResponseDTO menu;

    private MessageInfoResponseDTO message;

    private TableInfoResponseDTO table;

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
