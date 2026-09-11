package vn.tuhoc.vinaeatery.modules.auth.repositories.criteria;

import java.util.Optional;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCriteria {
    Integer page;

    Integer size;

    Optional<String> id;

    Optional<String> role;

    Optional<String> username;

    Optional<String> method;

    Optional<String> status;

    Optional<String> sort;
}
