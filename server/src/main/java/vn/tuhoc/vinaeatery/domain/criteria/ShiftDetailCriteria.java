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
public class ShiftDetailCriteria {
    // Properties
    private Optional<String> shiftId;
    private Optional<String> dayOfWeek;
    private Optional<String> timeStart;
    private Optional<String> timeEnd;
    private Optional<String> sort;
}
