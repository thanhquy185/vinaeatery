package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedAttributeNode;
import jakarta.persistence.NamedEntityGraph;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "messages")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "MessageEntity.half", attributeNodes = {
        @NamedAttributeNode("restaurant"),
        @NamedAttributeNode("useTable"),
})
@NamedEntityGraph(name = "MessageEntity.onlyUseTable", attributeNodes = {
        @NamedAttributeNode("useTable"),
})
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(columnDefinition = "DATETIME", nullable = false)
    String createAt;

    @Column(nullable = false)
    Boolean isRead;

    @OneToOne(mappedBy = "message", fetch = FetchType.LAZY)
    UseTableEntity useTable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    RestaurantEntity restaurant;

    @OneToMany(mappedBy = "message", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id.sendAt ASC")
    @Builder.Default
    List<MessageDetailEntity> messageDetails = new ArrayList<>();

    public void addMessageDetail(MessageDetailEntity messageDetailEntity) {
        this.messageDetails.add(messageDetailEntity);
        messageDetailEntity.setMessage(this);
    }

    public void removeMessageDetail(MessageDetailEntity messageDetailEntity) {
        this.messageDetails.remove(messageDetailEntity);
        messageDetailEntity.setMessage(null);
    }
}
