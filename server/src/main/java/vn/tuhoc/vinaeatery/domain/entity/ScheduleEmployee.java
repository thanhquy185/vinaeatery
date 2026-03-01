package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "schedule_employees")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleEmployee {
    // Properties
    @EmbeddedId
    private ScheduleEmployeeId id;
}
