package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;


import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryTableUpdateDTO {
    @NotNull(message = "Tên loại bàn không được để trống !")
    private String name;
    private String surchargeType;
    private Long surchargeValue;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    @NotNull(message = "Thời gian cập nhật không được để trống !")
    private LocalDateTime timeUpdate;
}
