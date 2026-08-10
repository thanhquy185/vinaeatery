package vn.tuhoc.vinaeatery.modules.global.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MessageDetailCreateRequestDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSendMessageRequestDTO {
    private Integer restaurantId;

    private Long useTableId;

    private MessageDetailCreateRequestDTO messageDetail;
}
