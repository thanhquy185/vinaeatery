package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BillDetailCreateRequestDTO {
    private Integer foodId;

    private Long quantity;

    private Long price;

    private String foodNameSnapshot;

    private String foodUnitSnapshot;

    private Long foodPriceSnapshot;

    private Long totalPriceDetail;
}
