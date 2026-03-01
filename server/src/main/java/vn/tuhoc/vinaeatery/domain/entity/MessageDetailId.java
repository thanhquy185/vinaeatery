package vn.tuhoc.vinaeatery.domain.entity;

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
public class MessageDetailId implements Serializable {
    // Properties
    private Integer messageId;
    @Column(columnDefinition = "DATETIME")
    private String sendAt;
    private Boolean isAdminSend;
}
