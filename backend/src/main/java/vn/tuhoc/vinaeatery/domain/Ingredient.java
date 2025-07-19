package vn.tuhoc.vinaeatery.domain;

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
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

@Entity
@Table(name = "ingredients")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Ingredient {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Tên nguyên liệu không được để trống !")
    private String name;
    @NotNull(message = "Loại nguyên liệu không được để trống !")
    private Integer categoryIngredientId;
    @NotNull(message = "Đơn vị không được để trống !")
    private String unit;
    @NotNull(message = "Định lượng không được để trống !")
    private Long capacity;
    @Column(columnDefinition = "DATE")
    private String dateCreate;
    @Column(columnDefinition = "DATE")
    private String dateRemove;
    private Long inputPrice;
    private Long inventory;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String note;
    @Convert(converter = CommonStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống !")
    private CommonStatusEnum status;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeUpdate;
}
