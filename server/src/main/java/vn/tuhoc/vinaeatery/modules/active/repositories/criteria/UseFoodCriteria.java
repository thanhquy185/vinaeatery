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
public class UseFoodCriteria {
    private Integer page;

    private Integer size;

    private Optional<String> id;

    private Optional<String> restaurantId;

    private Optional<String> foodId;

    private Optional<String> foodName;

    private Optional<String> categoryFoodId;

    private Optional<String> employeeId;

    private Optional<String> startAtStart;

    private Optional<String> startAtEnd;

    private Optional<String> endAtStart;

    private Optional<String> endAtEnd;

    private Optional<String> status;

    private Optional<String> sort;
}
