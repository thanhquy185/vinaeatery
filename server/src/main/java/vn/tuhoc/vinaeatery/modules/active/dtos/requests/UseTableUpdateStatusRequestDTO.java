package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseTableStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;

@Data
public class UseTableUpdateStatusRequestDTO {
    private Integer menuId;

    private Integer messageId;

    private Integer billId;

    private Integer reservationId;

    @NotNull(message = "Mã nhân viên không được để trống!")
    private Integer employeeId;

    private Integer customerId;

    @NotNull(message = "Thời gian kết thúc không được để trống!")
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
