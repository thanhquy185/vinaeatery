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
public class UseFoodCriteria {
    // Properties
    private Optional<String> id;
    private Optional<String> restaurantId;
    private Optional<String> timeStart;
    private Optional<String> timeEnd;
    private Optional<String> foodId;
    private Optional<String> foodName;
    private Optional<String> categoryFoodId;
    private Optional<String> employeeId;
    private Optional<String> status;
    private Optional<String> sort;
}
