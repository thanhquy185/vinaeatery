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
import jakarta.persistence.NamedSubgraph;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseFoodStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseFoodStatusEnum;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "use_foods")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(name = "UseFoodEntity.half", attributeNodes = {
                @NamedAttributeNode("restaurant"),
                @NamedAttributeNode(value = "food", subgraph = "foodSubgraph"),
                @NamedAttributeNode("employee"),
}, subgraphs = {
                @NamedSubgraph(name = "foodSubgraph", attributeNodes = {
                                @NamedAttributeNode("categoryFood")
                })
})
@NamedEntityGraph(name = "UseFoodEntity.onlyFood", attributeNodes = {
                @NamedAttributeNode(value = "food", subgraph = "foodSubgraph"),
}, subgraphs = {
                @NamedSubgraph(name = "foodSubgraph", attributeNodes = {
                                @NamedAttributeNode("categoryFood")
                })
})
public class UseFoodEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(columnDefinition = "DATETIME", nullable = false)
        private String startAt;

        @Column(columnDefinition = "DATETIME", nullable = true)
        private String endAt;

        @Column(columnDefinition = "VARCHAR(13)", nullable = false)
        @Convert(converter = UseFoodStatusConverter.class)
        private UseFoodStatusEnum status;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "restaurant_id", nullable = false)
        private RestaurantEntity restaurant;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "food_id", nullable = false)
        private FoodEntity food;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "employee_id", nullable = true)
        private EmployeeEntity employee;
}
