package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "message_details")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MessageDetail {
    // Properties
    @EmbeddedId
    private MessageDetailId id;
    @Column(columnDefinition = "TEXT")
    private String content;
}
