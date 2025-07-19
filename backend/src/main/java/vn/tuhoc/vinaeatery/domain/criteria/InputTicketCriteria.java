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
public class InputTicketCriteria {
    // Properties
    private Optional<String> id;
    private Optional<String> timeCreateStart;
    private Optional<String> timeCreateEnd;
    private Optional<String> employeeId;
    private Optional<String> supplierId;
    private Optional<String> statusMerge;
    private Optional<String> payStatus;
    private Optional<String> status;
    private Optional<String> sort;
}
