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
public class RoleHistoryCriteria {
    // Properties
    private Optional<String> employeeId;
    private Optional<String> roleId;
    private Optional<String> dateStart;
    private Optional<String> sort;
}
