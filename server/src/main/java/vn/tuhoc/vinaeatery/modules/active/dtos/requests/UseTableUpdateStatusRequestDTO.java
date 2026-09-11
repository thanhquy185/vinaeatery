package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseTableStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseTableUpdateStatusRequestDTO {
    Integer menuId;

    Integer messageId;

    Integer billId;

    Integer reservationId;

    @NotNull(message = "Mã nhân viên không được để trống!")
    Integer employeeId;

    Integer customerId;

    @NotNull(message = "Thời gian kết thúc không được để trống!")
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
