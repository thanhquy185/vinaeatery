package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shift_details")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ShiftDetail {
    // Properties
    @EmbeddedId
    private ShiftDetailId id;
}
