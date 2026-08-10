package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "feedback_experiences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackExperienceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "VARCHAR(8)")
    private String id;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TINYINT", nullable = false)
    private Integer index;
}
