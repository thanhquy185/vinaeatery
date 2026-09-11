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
import vn.tuhoc.vinaeatery.modules.active.domains.converters.OrderSheetStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "order_sheets")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "OrderSheetEntity.half", attributeNodes = {
                @NamedAttributeNode("restaurant"),
                @NamedAttributeNode("employee"),
                @NamedAttributeNode("useTable"),
})
public class OrderSheetEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Integer id;

        @Column(columnDefinition = "DATETIME", nullable = false)
        String createAt;

        @Column(columnDefinition = "DATETIME", nullable = true)
        String serviceAt;

        @Column(columnDefinition = "DATETIME", nullable = true)
        String cancelAt;

        @Column(nullable = false)
        Long totalPrice;

        @Column(columnDefinition = "TEXT", nullable = true)
        String note;

        @Column(columnDefinition = "TEXT", nullable = true)
        String message;

        @Column(columnDefinition = "VARCHAR(9)", nullable = false)
        @Convert(converter = OrderSheetStatusConverter.class)
        OrderSheetStatusEnum status;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "restaurant_id", nullable = false)
        RestaurantEntity restaurant;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "use_table_id", nullable = false)
        UseTableEntity useTable;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "employee_id", nullable = true)
        EmployeeEntity employee;

        @OneToMany(mappedBy = "orderSheet", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @Builder.Default
        List<OrderSheetDetailEntity> orderSheetDetails = new ArrayList<>();

        public void addOrderSheetDetail(OrderSheetDetailEntity orderSheetDetailEntity) {
                this.orderSheetDetails.add(orderSheetDetailEntity);
                orderSheetDetailEntity.setOrderSheet(this);
        }

        public void removeOrderSheetDetail(OrderSheetDetailEntity orderSheetDetailEntity) {
                this.orderSheetDetails.remove(orderSheetDetailEntity);
                orderSheetDetailEntity.setOrderSheet(null);
        }
}
