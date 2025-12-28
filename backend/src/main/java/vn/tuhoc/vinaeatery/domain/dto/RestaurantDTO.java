package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RestaurantDTO {
    private Integer id;
    private ManagerDTO manager;
    private List<RestaurantImageDTO> restaurantImages;
    private List<FoodDTO> restaurantFoods;
    private String createAt;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String description;
    private Float rating;
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
    private String updateAt;
    private Integer numberOfEmployees;
    private Integer numberOfFoods;
}
