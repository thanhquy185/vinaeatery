package vn.tuhoc.vinaeatery.modules.food.domains.entities;

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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "suppliers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(name = "SupplierEntity.full", attributeNodes = {
        @NamedAttributeNode("restaurant"),
})
public class SupplierEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String fullname;

    @Column(columnDefinition = "VARCHAR(11)", unique = true, nullable = true)
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

    @Column(nullable = false)
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private RestaurantEntity restaurant;
}
