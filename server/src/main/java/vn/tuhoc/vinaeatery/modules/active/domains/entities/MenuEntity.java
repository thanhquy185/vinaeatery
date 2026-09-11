package vn.tuhoc.vinaeatery.modules.active.domains.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.MenuTypeConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.MenuTypeEnum;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "menus")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "MenuEntity.half", attributeNodes = {
        @NamedAttributeNode("restaurant"),
})
public class MenuEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(nullable = false)
    String name;

    @Column(columnDefinition = "VARCHAR(9)", nullable = false)
    @Convert(converter = MenuTypeConverter.class)
    MenuTypeEnum type;

    @Column(nullable = false)
    Long price;

    @Column(columnDefinition = "MEDIUMTEXT", nullable = false)
    String description;

    @Column(columnDefinition = "VARCHAR(8)", nullable = false)
    @Convert(converter = CommonStatusConverter.class)
    CommonStatusEnum status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    RestaurantEntity restaurant;

    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    List<UseTableEntity> useTable;

    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<MenuDetailEntity> menuDetails = new ArrayList<>();

    public void addMenuDetail(MenuDetailEntity menuDetailEntity) {
        this.menuDetails.add(menuDetailEntity);
        menuDetailEntity.setMenu(this);
    }

    public void removeMenuDetail(MenuDetailEntity menuDetailEntity) {
        this.menuDetails.remove(menuDetailEntity);
        menuDetailEntity.setMenu(null);
    }
}
