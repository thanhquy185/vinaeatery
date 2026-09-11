package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseTableStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseTableSummaryResponseDTO {
    Long id;

    TableInfoResponseDTO table;

    String startAt;

    String endAt;

    String customerFullname;

    String customerPhone;

    String customerEmail;

    Integer customerAdult;

    Integer customerChild;

    Integer customerGuests;

    @Convert(converter = UseTableStatusConverter.class)
    UseTableStatusEnum status;
}
