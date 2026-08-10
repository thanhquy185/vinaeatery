package vn.tuhoc.vinaeatery.modules.active.repositories.criteria;

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
    private Integer page;

    private Integer size;

    private Optional<String> id;

    private Optional<String> restaurantId;

    private Optional<String> tableId;

    private Optional<String> tableName;

    private Optional<String> floorId;
    
    private Optional<String> employeeId;

    private Optional<String> customerId;

    private Optional<String> billId;

    private Optional<String> reservationId;

    private Optional<String> startAtStart;

    private Optional<String> startAtEnd;

    private Optional<String> endAtStart;

    private Optional<String> endAtEnd;

    private Optional<String> status;

    private Optional<String> sort;
}
