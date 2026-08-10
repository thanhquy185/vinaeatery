package vn.tuhoc.vinaeatery.modules.table.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FloorCrudResponseDTO {
    private Integer id;

    private String name;

    private String description;
}
