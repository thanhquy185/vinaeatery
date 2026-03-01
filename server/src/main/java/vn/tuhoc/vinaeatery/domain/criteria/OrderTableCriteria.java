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
public class OrderTableCriteria {
    // Properties
    private Optional<String> id;
    private Optional<String> restaurantId;
    private Optional<String> employeeId;
    private Optional<String> customerId;
    private Optional<String> createAtStart;
    private Optional<String> createAtEnd;
    private Optional<String> arriveAtStart;
    private Optional<String> arriveAtEnd;
    private Optional<String> customerFullname;
    private Optional<String> customerPhone;
    private Optional<String> customerEmail;
    private Optional<String> status;
    private Optional<String> sort;
}
