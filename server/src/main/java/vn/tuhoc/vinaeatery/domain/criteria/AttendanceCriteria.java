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
public class AttendanceCriteria {
    // Properties
    private Optional<String> id;
    private Optional<String> restaurantId;
    private Optional<String> employeeId;
    private Optional<String> shiftId;
    // private Optional<String> date;
    private Optional<String> leave;
    private Optional<String> status;
    private Optional<String> sort;
}
