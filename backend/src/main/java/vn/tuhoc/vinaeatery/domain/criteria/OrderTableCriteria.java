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
    private Optional<String> timeOrderStart;
    private Optional<String> timeOrderEnd;
    private Optional<String> timeArriveStart;
    private Optional<String> timeArriveEnd;
    private Optional<String> fullname;
    private Optional<String> phone;
    private Optional<String> email;
    private Optional<String> status;
    private Optional<String> sort;
}
