package vn.tuhoc.vinaeatery.modules.active.repositories.criteria;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderSheetCriteria {
    private Integer page;

    private Integer size;

    private Optional<String> id;

    private Optional<String> restaurantId;

    private Optional<String> employeeId;

    private Optional<String> tableId;

    private Optional<String> tableName;

    private Optional<String> floorId;

    private Optional<String> createAtStart;

    private Optional<String> createAtEnd;

    private Optional<String> serviceAtStart;

    private Optional<String> serviceAtEnd;

    private Optional<String> cancelAtStart;

    private Optional<String> cancelAtEnd;

    private Optional<String> status;

    private Optional<String> sort;
}
