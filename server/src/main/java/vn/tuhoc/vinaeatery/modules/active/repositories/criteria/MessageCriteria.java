package vn.tuhoc.vinaeatery.modules.active.repositories.criteria;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageCriteria {
    private Integer page;

    private Integer size;

    private Optional<String> id;

    private Optional<String> restaurantId;

    private Optional<String> useTableId;

    private Optional<String> createAtStart;

    private Optional<String> createAtEnd;

    private Optional<String> sort;
}
