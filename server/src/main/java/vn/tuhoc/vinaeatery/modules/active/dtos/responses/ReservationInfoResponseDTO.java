package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.ReservationStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservationInfoResponseDTO {
    private Integer id;

    private String createAt;

    private String arriveAt;

    private Integer customerId;

    private String customerFullname;

    private String customerPhone;

    private String customerEmail;

    private Integer customerGuests;

    private String customerNote;

    @Convert(converter = ReservationStatusConverter.class)
    private ReservationStatusEnum status;
}
