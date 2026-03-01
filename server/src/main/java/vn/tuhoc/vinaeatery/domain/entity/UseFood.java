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
import vn.tuhoc.vinaeatery.domain.enumm.UseFoodStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.UseFoodStatusConverter;

@Entity
@Table(name = "use_foods")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class UseFood {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @NotNull(message = "Thời gian bắt đầu không được để trống!")
    private LocalDateTime timeStart;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeEnd;
    private Integer foodId;
    private Integer employeeId;
    @Convert(converter = UseFoodStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private UseFoodStatusEnum status;
}
