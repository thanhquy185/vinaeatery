package vn.tuhoc.vinaeatery.modules.employee.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "permission_details")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionDetailEntity {
    @EmbeddedId
    PermissionDetailIdEntity id;

    @MapsId("permissionId")
    @ManyToOne
    @JsonIgnore
    PermissionEntity permission;

    @MapsId("functionId")
    @ManyToOne(fetch = FetchType.LAZY)
    FunctionEntity function;
}
