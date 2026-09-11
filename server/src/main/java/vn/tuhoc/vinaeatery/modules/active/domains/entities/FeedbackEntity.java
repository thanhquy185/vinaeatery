package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedAttributeNode;
import jakarta.persistence.NamedEntityGraph;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.FeedbackExperienceConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.FeedbackExperienceEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "feedbacks")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "FeedbackEntity.half", attributeNodes = {
        @NamedAttributeNode("restaurant"),
        @NamedAttributeNode("customer"),
})
public class FeedbackEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(columnDefinition = "DATETIME", nullable = false)
    String at;

    @Column(columnDefinition = "VARCHAR(8)", nullable = false)
    @Convert(converter = FeedbackExperienceConverter.class)
    FeedbackExperienceEnum experience;

    @Column(columnDefinition = "TINYINT", nullable = false)
    Integer score1;

    @Column(columnDefinition = "TINYINT", nullable = false)
    Integer score2;

    @Column(columnDefinition = "TINYINT", nullable = false)
    Integer score3;

    @Column(columnDefinition = "TINYINT", nullable = false)
    Integer score4;

    @Column(columnDefinition = "TINYINT", nullable = false)
    Integer score5;

    @Column(columnDefinition = "TEXT", nullable = false)
    String message;

    @OneToOne(mappedBy = "feedback", fetch = FetchType.LAZY)
    UseTableEntity useTable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = true)
    CustomerEntity customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    RestaurantEntity restaurant;
}
