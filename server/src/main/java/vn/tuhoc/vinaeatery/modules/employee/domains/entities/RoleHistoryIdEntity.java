package vn.tuhoc.vinaeatery.modules.employee.domains.entities;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleHistoryIdEntity implements Serializable {
    Integer employeeId;

    Integer roleId;

    @Column(columnDefinition = "DATE")
    String dateStart;
}
