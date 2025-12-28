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
public class HandlePaymentCriteria {
    // Properties
    private Optional<String> id;
    private Optional<String> useTableId;
    private Optional<String> status;
    private Optional<String> sort;
}
