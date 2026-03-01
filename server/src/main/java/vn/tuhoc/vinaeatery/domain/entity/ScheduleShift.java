package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "schedule_shifts")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleShift {
    // Properties
    @EmbeddedId
    private ScheduleShiftId id;
}
