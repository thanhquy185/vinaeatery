package vn.tuhoc.vinaeatery.domain;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "role_details")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleDetail {
    // Properties
    @EmbeddedId
    private RoleDetailId id;
}
