package vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RestaurantImageCreateRequestDTO {
    String image;
}
