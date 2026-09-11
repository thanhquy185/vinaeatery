package vn.tuhoc.vinaeatery.modules.global.dtos.requests;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MessageDetailCreateRequestDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RestaurantSendMessageRequestDTO {
    Integer messageId;

    MessageDetailCreateRequestDTO messageDetail;
}
