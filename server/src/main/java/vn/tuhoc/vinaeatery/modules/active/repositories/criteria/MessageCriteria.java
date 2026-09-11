package vn.tuhoc.vinaeatery.modules.active.repositories.criteria;

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
public class MessageCriteria {
    Integer page;

    Integer size;

    Optional<String> id;

    Optional<String> restaurantId;

    Optional<String> useTableId;

    Optional<String> createAtStart;

    Optional<String> createAtEnd;

    Optional<String> sort;
}
