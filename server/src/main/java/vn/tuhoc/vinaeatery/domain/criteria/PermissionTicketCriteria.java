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
public class PermissionTicketCriteria {
    // Properties
    private Optional<String> id;
    private Optional<String> restaurantId;
    private Optional<String> createAtStart;
    private Optional<String> createAtEnd;
    private Optional<String> employeeHandleId;
    private Optional<String> employeeMainId;
    private Optional<String> categoryPermissionTicketId;
    private Optional<String> date;
    private Optional<String> status;
    private Optional<String> sort;
}
