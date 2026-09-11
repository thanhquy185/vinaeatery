package vn.tuhoc.vinaeatery.modules.table.domains.entities;

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
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "tables")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "TableEntity.full", attributeNodes = {
                @NamedAttributeNode("restaurant"),
                @NamedAttributeNode("floor"),
                @NamedAttributeNode("categoryTable"),
})
@NamedEntityGraph(name = "TableEntity.half", attributeNodes = {
                @NamedAttributeNode("floor"),
                @NamedAttributeNode("categoryTable"),
})
public class TableEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Integer id;

        @Column(nullable = false)
        String name;

        @Column(nullable = false)
        Integer seats;

        @Column(columnDefinition = "MEDIUMTEXT", nullable = true)
        String description;

        @Column(columnDefinition = "VARCHAR(8)", nullable = false)
        @Convert(converter = CommonStatusConverter.class)
        CommonStatusEnum status;

        @OneToMany(mappedBy = "table", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<UseTableEntity> useTables;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "restaurant_id", nullable = false)
        private RestaurantEntity restaurant;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "floor_id")
        private FloorEntity floor;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "category_table_id")
        private CategoryTableEntity categoryTable;
}
