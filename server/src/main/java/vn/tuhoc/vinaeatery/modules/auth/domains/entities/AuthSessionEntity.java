package vn.tuhoc.vinaeatery.modules.auth.domains.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "auth_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthSessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "DATETIME", nullable = false)
    private String createAt;

    @Column(columnDefinition = "DATETIME", nullable = false)
    private String expiredAt;

    @Column(columnDefinition = "DATETIME", nullable = true)
    private String revokedAt;

    @Column(columnDefinition = "MEDIUMTEXT", nullable = false)
    private String refreshToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
}
