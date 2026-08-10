package vn.tuhoc.vinaeatery.modules.employee.domains.entities;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionDetailIdEntity implements Serializable {
    private Integer permissionId;

    private Integer functionId;

    private String action;
}
