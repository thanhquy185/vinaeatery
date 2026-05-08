package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.FoodStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.FoodStatusConverter;

@Entity
@Table(name = "foods")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Food {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    private String image;
    @NotNull(message = "Tên món ăn không được để trống!")
    private String name;
    @NotNull(message = "Loại món ăn không được để trống!")
    private Integer categoryFoodId;
    @NotNull(message = "Đơn vị không được để trống!")
    private String unit;
    @NotNull(message = "Giá bán không được để trống!")
    private Long price;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    @Convert(converter = FoodStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private FoodStatusEnum status;
}
