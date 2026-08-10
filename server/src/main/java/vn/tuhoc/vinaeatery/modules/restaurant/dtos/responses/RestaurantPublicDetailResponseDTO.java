package vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RestaurantPublicDetailResponseDTO {
    private Integer id;

    private ManagerInfoResponseDTO manager;

    private String openAt;

    private String closeAt;

    private String thumbnail;

    private String name;

    private String phone;

    private String email;

    private Double latitude;

    private Double longitude;

    private String houseNumber;

    private String streetName;

    private String ward;

    private String province;

    private String description;

    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;

    List<RestaurantImageDetailResponseDTO> restaurantImages;

    List<FoodInfoResponseDTO> foods;
}
