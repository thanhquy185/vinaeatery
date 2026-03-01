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
public class ScheduleEmployeeId implements Serializable {
    // Properties
    private Integer scheduleId;
    private Integer employeeId;
}
