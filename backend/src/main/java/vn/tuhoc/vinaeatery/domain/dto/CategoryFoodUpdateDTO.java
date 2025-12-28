package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryFoodUpdateDTO {
    // Properties
    private String image;
    @NotNull(message = "Tên loại nguyên liệu không được để trống !")
    private String name;
    private String description;
    @NotNull(message = "Thời gian cập nhật không được để trống !")
    private LocalDateTime updateAt;
}
