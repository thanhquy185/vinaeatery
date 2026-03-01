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
public class CategoryRewardPunishCriteria {
    // Properties
    private Optional<String> id;
    private Optional<String> restaurantId;
    private Optional<String> name;
    private Optional<String> handle;
    private Optional<String> status;
    private Optional<String> sort;
}
