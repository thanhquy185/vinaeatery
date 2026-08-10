package vn.tuhoc.vinaeatery.modules.restaurant.domains.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.NamedAttributeNode;
import jakarta.persistence.NamedEntityGraph;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonGenderConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonGenderEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;

@Entity
@Table(name = "managers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(name = "ManagerEntity.full", attributeNodes = {
        @NamedAttributeNode("user"),
})
public class ManagerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = true)
    private String image;

    @Column(nullable = false)
    private String fullname;

    @Column(columnDefinition = "DATE", nullable = false)
    private String birthdate;

    @Column(columnDefinition = "VARCHAR(6)", nullable = false)
    @Convert(converter = CommonGenderConverter.class)
    private CommonGenderEnum gender;

    @Column(columnDefinition = "VARCHAR(11)", unique = true, nullable = false)
    private String phone;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(columnDefinition = "VARCHAR(25)", nullable = false)
    private String houseNumber;

    @Column(columnDefinition = "VARCHAR(100)", nullable = false)
    private String streetName;

    @Column(columnDefinition = "VARCHAR(30)", nullable = false)
    private String ward;

    @Column(columnDefinition = "VARCHAR(25)", nullable = false)
    private String province;

    @Column(columnDefinition = "MEDIUMTEXT", nullable = true)
    private String description;

    @Column(nullable = false)
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @OneToMany(mappedBy = "manager", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    List<RestaurantEntity> restaurants;
}
