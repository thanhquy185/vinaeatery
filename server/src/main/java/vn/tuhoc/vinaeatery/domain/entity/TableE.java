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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

@Entity
@Table(name = "tables")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TableE {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    @NotNull(message = "Tên bàn không được để trống!")
    private String name;
    @NotNull(message = "Loại bàn không được để trống!")
    private Integer categoryTableId;
    @NotNull(message = "Tầng không được để trống!")
    private Integer floorId;
    @NotNull(message = "Số chỗ ngồi không được để trống!")
    private Integer seats;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    @Convert(converter = CommonStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private CommonStatusEnum status;
}
