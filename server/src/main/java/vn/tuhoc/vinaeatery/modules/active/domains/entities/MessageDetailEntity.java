package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
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
@Table(name = "message_details")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageDetailEntity {
    @EmbeddedId
    MessageDetailIdEntity id;

    @MapsId("messageId")
    @ManyToOne
    @JsonIgnore
    MessageEntity message;

    @Column(columnDefinition = "TEXT")
    String content;
}
