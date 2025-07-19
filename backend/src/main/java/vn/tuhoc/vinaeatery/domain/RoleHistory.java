package vn.tuhoc.vinaeatery.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "role_histories")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoleHistory {
    // Properties
    @EmbeddedId
    private RoleHistoryId id;
    @Column(columnDefinition = "DATE")
    private String dateEnd;
}
