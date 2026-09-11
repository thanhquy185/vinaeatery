package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseTableStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseTableCreateRequestDTO {
    @NotNull(message = "Mã nhà hàng không được để trống!")
    Integer restaurantId;

    Integer menuId;

    Integer messageId;

    Integer billId;

    Integer reservationId;

    @NotNull(message = "Mã bàn ăn không được để trống!")
    Integer tableId;

    Integer employeeId;

    Integer customerId;

    @NotNull(message = "Thời gian bắt đầu không được để trống!")
    String startAt;

    String endAt;

    String customerFullname;

    String customerPhone;

    String customerEmail;

    Integer customerAdult;

    Integer customerChild;

    Integer customerGuests;

    @NotNull(message = "Trạng thái không được để trống!")
    @Convert(converter = UseTableStatusConverter.class)
    UseTableStatusEnum status;
}
