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
public class InsuranceDetailCriteria {
    // Properties
    private Optional<String> insuranceId;
    private Optional<String> employeeId;
    private Optional<String> categoryInsuranceId;
    private Optional<String> sort;
}
