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
public class PermissionDetailCriteria {
    // Properties
    private Optional<String> permissionId;
    private Optional<String> functionId;
    private Optional<String> action;
    private Optional<String> sort;
}
