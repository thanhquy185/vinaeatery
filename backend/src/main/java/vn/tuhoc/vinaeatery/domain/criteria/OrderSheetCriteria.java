package vn.tuhoc.vinaeatery.domain.criteria;

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
    // Properties
    private Optional<String> id;
    private Optional<String> restaurantId;
    private Optional<String> createAtStart;
    private Optional<String> createAtEnd;
    private Optional<String> serviceAtStart;
    private Optional<String> serviceAtEnd;
    private Optional<String> currentDate;
    private Optional<String> employeeId;
    private Optional<String> tableId;
    private Optional<String> tableName;
    private Optional<String> floorId;
    private Optional<String> status;
    private Optional<String> sort;
}
