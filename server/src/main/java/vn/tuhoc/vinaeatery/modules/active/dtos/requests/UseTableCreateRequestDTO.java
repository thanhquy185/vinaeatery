package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseTableStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;

@Data
@Builder
public class UseTableCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;

    private Integer menuId;

    private Integer messageId;

    private Integer billId;

    private Integer reservationId;

    @NotNull(message = "Mã bàn ăn không được để trống!")
    private Integer tableId;

    private Integer employeeId;

    private Integer customerId;

    @NotNull(message = "Thời gian bắt đầu không được để trống!")
    private String startAt;

    private String endAt;

    private String customerFullname;

    private String customerPhone;

    private String customerEmail;

    private Integer customerAdult;

    private Integer customerChild;

    private Integer customerGuests;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = UseTableStatusConverter.class)
    private UseTableStatusEnum status;
}
