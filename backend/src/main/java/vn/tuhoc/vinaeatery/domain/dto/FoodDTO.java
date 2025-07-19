package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.CategoryFood;
import vn.tuhoc.vinaeatery.domain.enumm.FoodStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.FoodStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FoodDTO {
    // Properties
    private Integer id;
    private String image;
    private String name;
    private CategoryFood categoryFood;
    private String unit;
    private Long price;
    private String description;
    @Convert(converter = FoodStatusConverter.class)
    private FoodStatusEnum status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeUpdate;
    private List<RecipeDTO> recipe;
}
