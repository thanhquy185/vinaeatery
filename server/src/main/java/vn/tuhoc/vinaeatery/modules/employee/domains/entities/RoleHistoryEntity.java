package vn.tuhoc.vinaeatery.modules.employee.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "role_histories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleHistoryEntity {
    @EmbeddedId
    RoleHistoryIdEntity id;

    @MapsId("employeeId")
    @ManyToOne
    @JsonIgnore
    EmployeeEntity employee;

    @MapsId("roleId")
    @ManyToOne(fetch = FetchType.LAZY)
    RoleEntity role;

    @Column(columnDefinition = "DATE", nullable = true)
    String dateEnd;
}
