package vn.tuhoc.vinaeatery.modules.table.dtos.responses;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableCrudResponseDTO {
    Integer id;

    FloorInfoResponseDTO floor;

    CategoryTableInfoResponseDTO categoryTable;

    String name;

    Integer seats;

    String description;
}
