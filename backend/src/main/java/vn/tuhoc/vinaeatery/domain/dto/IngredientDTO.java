package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.CategoryIngredient;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class IngredientDTO {
     // Properties
    private Integer id;
    private String name;
    private CategoryIngredient categoryIngredient;
    private String unit;
    private Long capacity;
    private String dateCreate;
    private String dateRemove;
    private Long inputPrice;
    private Long inventory;
    private String note;
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeUpdate;
}
