package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import lombok.Data;

@Data
public class OrderSheetDetailCreateRequestDTO {
    private Integer foodId;

    private Long quantity;

    private Long price;

    private String foodNameSnapshot;

    private String foodUnitSnapshot;

    private Long foodPriceSnapshot;

    private Long totalPriceDetail;
}
