package vn.tuhoc.vinaeatery.modules.global.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantReadMessageRequestDTO {
    private Integer messageId;
}
