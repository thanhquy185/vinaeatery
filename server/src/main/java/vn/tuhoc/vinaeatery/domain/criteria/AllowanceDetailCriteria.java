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
public class AllowanceDetailCriteria {
    // Properties
    private Optional<String> allowanceId;
    private Optional<String> employeeId;
    private Optional<String> categoryAllowanceId;
    private Optional<String> sort;
}
