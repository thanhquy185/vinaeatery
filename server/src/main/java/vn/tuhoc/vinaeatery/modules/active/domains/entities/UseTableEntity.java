package vn.tuhoc.vinaeatery.modules.active.domains.entities;

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
import jakarta.persistence.NamedSubgraph;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.UseTableStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity;

@Entity
@Table(name = "use_tables")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "UseTableEntity.half", attributeNodes = {
                @NamedAttributeNode("restaurant"),
                // @NamedAttributeNode("paymentMachine"),
                @NamedAttributeNode("feedback"),
                @NamedAttributeNode("menu"),
                @NamedAttributeNode("message"),
                @NamedAttributeNode("bill"),
                // @NamedAttributeNode("reservation"), // Bị lỗi không thể dùng cách này
                @NamedAttributeNode(value = "table", subgraph = "tableSubgraph"),
                @NamedAttributeNode("employee"),
                @NamedAttributeNode("customer"),
}, subgraphs = {
                @NamedSubgraph(name = "tableSubgraph", attributeNodes = {
                                @NamedAttributeNode("floor"),
                                @NamedAttributeNode("categoryTable")
                })
})
@NamedEntityGraph(name = "UseTableEntity.onlyTable", attributeNodes = {
                @NamedAttributeNode(value = "table", subgraph = "tableSubgraph")
}, subgraphs = {
                @NamedSubgraph(name = "tableSubgraph", attributeNodes = {
                                @NamedAttributeNode("floor"),
                                @NamedAttributeNode("categoryTable")
                })
})
public class UseTableEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Long id;

        @Column(columnDefinition = "DATETIME", nullable = false)
        String startAt;

        @Column(columnDefinition = "DATETIME", nullable = true)
        String endAt;

        @Column(nullable = true)
        String customerFullname;

        @Column(columnDefinition = "VARCHAR(11)", nullable = true)
        String customerPhone;

        @Column(nullable = true)
        String customerEmail;

        @Column(nullable = true)
        Integer customerAdult;

        @Column(nullable = true)
        Integer customerChild;

        @Column(nullable = true)
        Integer customerGuests;

        @Column(columnDefinition = "VARCHAR(8)", nullable = false)
        @Convert(converter = UseTableStatusConverter.class)
        UseTableStatusEnum status;

        @OneToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "payment_machine_id", nullable = true)
        PaymentMachineEntity paymentMachine;

        @OneToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "feedback_id", nullable = true)
        FeedbackEntity feedback;

        @OneToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "message_id", nullable = true)
        MessageEntity message;

        @OneToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "bill_id", nullable = true)
        BillEntity bill;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "restaurant_id", nullable = false)
        RestaurantEntity restaurant;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "menu_id", nullable = true)
        MenuEntity menu;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "reservation_id", nullable = false)
        ReservationEntity reservation;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "table_id", nullable = false)
        TableEntity table;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "employee_id", nullable = true)
        EmployeeEntity employee;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "customer_id", nullable = true)
        CustomerEntity customer;

        @OneToMany(mappedBy = "useTable", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        List<OrderSheetEntity> orderSheets;
}
