package vn.tuhoc.vinaeatery.modules.table.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TableCrudResponseDTO {
    private Integer id;

    private FloorInfoResponseDTO floor;

    private CategoryTableInfoResponseDTO categoryTable;

    private String name;

    private Integer seats;

    private String description;
}
