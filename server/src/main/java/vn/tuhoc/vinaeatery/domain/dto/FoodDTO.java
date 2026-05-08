package vn.tuhoc.vinaeatery.domain.dto;

import java.util.List;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.CategoryFood;
import vn.tuhoc.vinaeatery.domain.enumm.FoodStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.FoodStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FoodDTO {
    // Properties
    private Integer id;
    private Integer restaurantId;
    private String image;
    private String name;
    private CategoryFood categoryFood;
    private String unit;
    private Long price;
    private String description;
    @Convert(converter = FoodStatusConverter.class)
    private FoodStatusEnum status;
    private List<RecipeDTO> recipe;
}
