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
public class UseFoodCriteria {
    Integer page;

    Integer size;

    Optional<String> id;

    Optional<String> restaurantId;

    Optional<String> foodId;

    Optional<String> foodName;

    Optional<String> categoryFoodId;

    Optional<String> employeeId;

    Optional<String> startAtStart;

    Optional<String> startAtEnd;

    Optional<String> endAtStart;

    Optional<String> endAtEnd;

    Optional<String> status;

    Optional<String> sort;
}
