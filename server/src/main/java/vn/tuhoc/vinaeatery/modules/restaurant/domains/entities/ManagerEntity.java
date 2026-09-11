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
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
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
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "ManagerEntity.full", attributeNodes = {
        @NamedAttributeNode("user"),
})
public class ManagerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(nullable = true)
    String image;

    @Column(nullable = false)
    String fullname;

    @Column(columnDefinition = "DATE", nullable = false)
    String birthdate;

    @Column(columnDefinition = "VARCHAR(6)", nullable = false)
    @Convert(converter = CommonGenderConverter.class)
    CommonGenderEnum gender;

    @Column(columnDefinition = "VARCHAR(11)", unique = true, nullable = false)
    String phone;

    @Column(unique = true, nullable = false)
    String email;

    @Column(columnDefinition = "VARCHAR(25)", nullable = false)
    String houseNumber;

    @Column(columnDefinition = "VARCHAR(100)", nullable = false)
    String streetName;

    @Column(columnDefinition = "VARCHAR(30)", nullable = false)
    String ward;

    @Column(columnDefinition = "VARCHAR(25)", nullable = false)
    String province;

    @Column(columnDefinition = "MEDIUMTEXT", nullable = true)
    String description;

    @Column(nullable = false)
    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    UserEntity user;

    @OneToMany(mappedBy = "manager", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    List<RestaurantEntity> restaurants;
}
