package vn.tuhoc.vinaeatery.modules.global.dtos.responses;

import java.util.List;

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
public class PageResponseDTO<T> {
    List<T> content;

    int totalPages;

    long totalElements;

    boolean first;

    boolean last;

    int numberOfElements;

    int size;

    int number;
}
