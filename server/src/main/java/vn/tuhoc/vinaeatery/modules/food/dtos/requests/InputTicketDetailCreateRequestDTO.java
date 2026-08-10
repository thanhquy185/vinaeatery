package vn.tuhoc.vinaeatery.modules.food.dtos.requests;

import lombok.Data;

@Data
public class InputTicketDetailCreateRequestDTO {
    private Integer ingredientId;

    private Long quantity;

    private Long inputPrice;

    private String ingredientNameSnapshot;

    private Long ingredientInputPriceSnapshot;

    private Long totalInputPriceDetail;
}
