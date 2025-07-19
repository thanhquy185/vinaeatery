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
public class EmployeeCriteria {
    // Properties
    private Optional<String> id;
    private Optional<String> fullname;
    private Optional<String> phone;
    private Optional<String> email;
    private Optional<String> roleId;
    private Optional<String> username;
    private Optional<String> status;
    private Optional<String> sort;
}
