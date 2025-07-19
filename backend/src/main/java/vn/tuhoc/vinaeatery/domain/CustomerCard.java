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
@Table(name = "customer_cards")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CustomerCard {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String image;
    @NotNull(message = "Tên thẻ khách hàng không được để trống !")
    private String name;
    @NotNull(message = "Mức tiêu không được để trống !")
    private Long threshold;
    @NotNull(message = "Giảm giá không được để trống !")
    private Integer discount;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    @Convert(converter = CommonStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống !")
    private CommonStatusEnum status;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeUpdate;
}
