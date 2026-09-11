package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationCrudResponseDTO {
    Integer id;

    String createAt;

    String arriveAt;

    String customerFullname;

    String customerPhone;

    String customerEmail;

    Integer customerGuests;

    String customerNote;
}
