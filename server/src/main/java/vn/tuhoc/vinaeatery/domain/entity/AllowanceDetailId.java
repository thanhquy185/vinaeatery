package vn.tuhoc.vinaeatery.domain.entity;

import java.io.Serializable;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class AllowanceDetailId implements Serializable {
    // Properties
    private Integer allowanceId;
    private Integer employeeId;
    private Integer categoryAllowanceId;
}
