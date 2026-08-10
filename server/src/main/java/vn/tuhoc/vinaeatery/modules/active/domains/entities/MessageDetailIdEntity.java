package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import java.io.Serializable;

import jakarta.persistence.Column;
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
public class MessageDetailIdEntity implements Serializable {
    private Integer messageId;

    @Column(columnDefinition = "DATETIME")
    private String sendAt;

    private Boolean isRestaurantSend;
}
