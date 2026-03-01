package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.UseFoodStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.UseFoodStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UseFoodDTO {
    // Properties
    private Long id;
    private Integer restaurantId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeStart;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeEnd;
    private FoodDTO food;
    private EmployeeDTO employee;
    @Convert(converter = UseFoodStatusConverter.class)
    private UseFoodStatusEnum status;
}
