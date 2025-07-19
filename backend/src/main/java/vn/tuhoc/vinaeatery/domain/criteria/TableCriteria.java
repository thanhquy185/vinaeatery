package vn.tuhoc.vinaeatery.domain.criteria;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TableCriteria {
    // Properties
    private Optional<String> id;
    private Optional<String> name;
    private Optional<String> categoryTableId;
    private Optional<String> floorId;
    private Optional<String> status;
    private Optional<String> sort;
}
