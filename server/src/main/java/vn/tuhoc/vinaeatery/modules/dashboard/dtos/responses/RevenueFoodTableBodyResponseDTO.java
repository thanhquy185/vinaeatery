package vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RevenueFoodTableBodyResponseDTO {
    private String name;

    private Long price;

    private Long quantity;

    private Long revenue;

    private Integer rowSpan;
}
