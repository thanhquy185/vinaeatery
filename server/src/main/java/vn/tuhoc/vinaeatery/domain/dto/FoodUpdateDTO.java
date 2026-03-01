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
public class FoodUpdateDTO {
    private String image;
    @NotNull(message = "Tên món ăn không được để trống!")
    private String name;
    @NotNull(message = "Loại món ăn không được để trống!")
    private Integer categoryFoodId;
    @NotNull(message = "Đơn vị không được để trống!")
    private String unit;
    @NotNull(message = "Giá bán không được để trống!")
    private Long price;
    private String description;
    @NotNull(message = "Ngày cập nhật không được để trống!")
    private LocalDateTime updateAt;
}
