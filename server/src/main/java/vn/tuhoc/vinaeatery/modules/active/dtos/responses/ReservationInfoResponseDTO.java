package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.ReservationStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationInfoResponseDTO {
    Integer id;

    String createAt;

    String arriveAt;

    Integer customerId;

    String customerFullname;

    String customerPhone;

    String customerEmail;

    Integer customerGuests;

    String customerNote;

    @Convert(converter = ReservationStatusConverter.class)
    ReservationStatusEnum status;
}
