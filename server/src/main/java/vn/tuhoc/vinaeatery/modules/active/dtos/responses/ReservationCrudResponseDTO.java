package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservationCrudResponseDTO {
    private Integer id;

    private String createAt;

    private String arriveAt;

    private String customerFullname;

    private String customerPhone;

    private String customerEmail;

    private Integer customerGuests;

    private String customerNote;
}
