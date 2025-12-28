package vn.tuhoc.vinaeatery.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleDetailForCrud {
    // Properties
    private Integer functionId;
    private String action;
}
