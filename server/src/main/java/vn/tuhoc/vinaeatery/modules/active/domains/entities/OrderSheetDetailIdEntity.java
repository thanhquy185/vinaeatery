package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class OrderSheetDetailIdEntity implements Serializable {
    private Integer orderSheetId;

    private Integer foodId;
}
