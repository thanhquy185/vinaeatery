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
public class UseTableCriteria {
    // Properties
    private Optional<String> id;
    private Optional<String> restaurantId;
    private Optional<String> timeStart;
    private Optional<String> timeEnd;
    private Optional<String> employeeId;
    private Optional<String> customerId;
    private Optional<String> tableId;
    private Optional<String> tableName;
    private Optional<String> floorId;
    private Optional<String> orderId;
    private Optional<String> orderTableId;
    private Optional<String> status;
    private Optional<String> sort;
}
