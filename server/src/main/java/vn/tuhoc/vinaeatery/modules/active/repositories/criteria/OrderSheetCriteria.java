package vn.tuhoc.vinaeatery.modules.active.repositories.criteria;

import java.util.Optional;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSheetCriteria {
    Integer page;

    Integer size;

    Optional<String> id;

    Optional<String> restaurantId;

    Optional<String> employeeId;

    Optional<String> tableId;

    Optional<String> tableName;

    Optional<String> floorId;

    Optional<String> createAtStart;

    Optional<String> createAtEnd;

    Optional<String> serviceAtStart;

    Optional<String> serviceAtEnd;

    Optional<String> cancelAtStart;

    Optional<String> cancelAtEnd;

    Optional<String> status;

    Optional<String> sort;
}
