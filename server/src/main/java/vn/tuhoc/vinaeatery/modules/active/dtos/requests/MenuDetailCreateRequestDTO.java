package vn.tuhoc.vinaeatery.modules.active.dtos.requests;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MenuDetailCreateRequestDTO {
    Integer foodId;
}
