package vn.tuhoc.vinaeatery.modules.auth.repositories.criteria;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserCriteria {
    private Integer page;

    private Integer size;

    private Optional<String> id;

    private Optional<String> role;

    private Optional<String> username;

    private Optional<String> method;

    private Optional<String> status;

    private Optional<String> sort;
}
