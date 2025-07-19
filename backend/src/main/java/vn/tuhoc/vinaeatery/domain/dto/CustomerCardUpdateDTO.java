package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CustomerCardUpdateDTO {
    // Properties
    private String image;
    private String name;
    private Long threshold;
    private Integer discount;
    private String description;
    private LocalDateTime timeUpdate;
}
