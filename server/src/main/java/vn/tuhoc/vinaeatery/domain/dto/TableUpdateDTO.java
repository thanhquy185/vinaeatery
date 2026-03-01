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
public class TableUpdateDTO {
    // Properties
    private String name;
    private Integer categoryTableId;
    private Integer floorId;
    private Integer seats;
    private String description;
    private LocalDateTime updateAt;
}
