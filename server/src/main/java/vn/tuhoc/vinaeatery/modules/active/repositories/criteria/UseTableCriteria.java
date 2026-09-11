package vn.tuhoc.vinaeatery.modules.active.repositories.criteria;

import java.util.Optional;

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
public class UseTableCriteria {
    Integer page;

    Integer size;

    Optional<String> id;

    Optional<String> restaurantId;

    Optional<String> tableId;

    Optional<String> tableName;

    Optional<String> floorId;

    Optional<String> employeeId;

    Optional<String> customerId;

    Optional<String> billId;

    Optional<String> reservationId;

    Optional<String> startAtStart;

    Optional<String> startAtEnd;

    Optional<String> endAtStart;

    Optional<String> endAtEnd;

    Optional<String> status;

    Optional<String> sort;
}
