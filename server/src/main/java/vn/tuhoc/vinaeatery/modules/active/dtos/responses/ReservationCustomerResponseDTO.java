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
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationCustomerResponseDTO {
    Integer id;

    RestaurantSubInfoResponseDTO restaurant;

    String createAt;

    String arriveAt;

    String customerFullname;

    String customerPhone;

    String customerEmail;

    Integer customerGuests;

    String customerNote;

    @Convert(converter = ReservationStatusConverter.class)
    ReservationStatusEnum status;

}
