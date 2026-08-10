package vn.tuhoc.vinaeatery.modules.active.dtos.responses;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseTableStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableInfoResponseDTO;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UseTableSummaryResponseDTO {
    private Long id;

    private TableInfoResponseDTO table;

    private String startAt;

    private String endAt;

    private String customerFullname;

    private String customerPhone;

    private String customerEmail;

    private Integer customerAdult;

    private Integer customerChild;

    private Integer customerGuests;

    @Convert(converter = UseTableStatusConverter.class)
    private UseTableStatusEnum status;
}
