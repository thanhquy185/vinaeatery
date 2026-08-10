package vn.tuhoc.vinaeatery.modules.employee.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "role_histories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleHistoryEntity {
    @EmbeddedId
    private RoleHistoryIdEntity id;

    @MapsId("employeeId")
    @ManyToOne
    @JsonIgnore
    private EmployeeEntity employee;

    @MapsId("roleId")
    @ManyToOne(fetch = FetchType.LAZY)
    private RoleEntity role;

    @Column(columnDefinition = "DATE", nullable = true)
    private String dateEnd;
}
