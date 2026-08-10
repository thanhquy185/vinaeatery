package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "message_details")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDetailEntity {
    @EmbeddedId
    private MessageDetailIdEntity id;

    @MapsId("messageId")
    @ManyToOne
    @JsonIgnore
    private MessageEntity message;

    @Column(columnDefinition = "TEXT")
    private String content;
}
