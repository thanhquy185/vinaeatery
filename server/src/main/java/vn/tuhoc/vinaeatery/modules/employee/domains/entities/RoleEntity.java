package vn.tuhoc.vinaeatery.modules.employee.domains.entities;

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
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.domains.converters.RoleSalaryTypeConverter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.RoleSalaryTypeEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "roles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "RoleEntity.full", attributeNodes = {
        @NamedAttributeNode("restaurant"),
})
public class RoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(nullable = false)
    String name;

    @Column(columnDefinition = "VARCHAR(5)", nullable = false)
    @Convert(converter = RoleSalaryTypeConverter.class)
    RoleSalaryTypeEnum salaryType;

    @Column(nullable = false)
    Long salaryValue;

    @Column(columnDefinition = "VARCHAR(8)", nullable = false)
    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    RestaurantEntity restaurant;
}
