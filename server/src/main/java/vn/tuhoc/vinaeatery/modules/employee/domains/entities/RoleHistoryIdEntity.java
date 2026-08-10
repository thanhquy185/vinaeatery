package vn.tuhoc.vinaeatery.modules.employee.domains.entities;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class RoleHistoryIdEntity implements Serializable {
    private Integer employeeId;

    private Integer roleId;

    @Column(columnDefinition = "DATE")
    private String dateStart;
}
