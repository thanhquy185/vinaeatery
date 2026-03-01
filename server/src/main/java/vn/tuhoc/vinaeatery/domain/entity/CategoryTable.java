package vn.tuhoc.vinaeatery.domain.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

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
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.CategoryTableSurchargeTypeEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;
import vn.tuhoc.vinaeatery.repository.converter.CategoryTableSurchargeTypeConverter;

@Entity
@Table(name = "category_tables")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryTable {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    @NotNull(message = "Tên loại bàn không được để trống!")
    private String name;
    @Column(columnDefinition = "VARCHAR(10)")
    @Convert(converter = CategoryTableSurchargeTypeConverter.class)
    private CategoryTableSurchargeTypeEnum surchargeType;
    private Long surchargeValue;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    @Convert(converter = CommonStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private CommonStatusEnum status;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateAt;
}
