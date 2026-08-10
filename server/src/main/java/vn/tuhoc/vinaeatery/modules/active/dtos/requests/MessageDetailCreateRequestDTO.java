package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import lombok.Data;

@Data
public class MessageDetailCreateRequestDTO {
    private String sendAt;

    private Boolean isRestaurantSend;

    private String content;
}
