package vn.tuhoc.vinaeatery.modules.food.domains.entities;

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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.converters.InputTicketStatusConverter;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "input_tickets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(name = "InputTicketEntity.half", attributeNodes = {
                @NamedAttributeNode("restaurant"),
                @NamedAttributeNode("employee"),
                @NamedAttributeNode("supplier")
})
@NamedEntityGraph(name = "InputTicketEntity.onlyEmployeeAndSupplier", attributeNodes = {
                @NamedAttributeNode("employee"),
                @NamedAttributeNode("supplier")
})
public class InputTicketEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @Column(columnDefinition = "DATETIME", nullable = false)
        private String createAt;

        @Column(nullable = false)
        private Long totalInputPrice;

        @Column(columnDefinition = "VARCHAR(6)", nullable = false)
        @Convert(converter = InputTicketPaymentStatusConverter.class)
        private InputTicketPaymentStatusEnum paymentStatus;

        @Column(columnDefinition = "VARCHAR(9)", nullable = false)
        @Convert(converter = InputTicketStatusConverter.class)
        private InputTicketStatusEnum status;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "restaurant_id", nullable = false)
        private RestaurantEntity restaurant;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "employee_id", nullable = false)
        private EmployeeEntity employee;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "supplier_id", nullable = false)
        private SupplierEntity supplier;

        @OneToMany(mappedBy = "inputTicket", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @Builder.Default
        List<InputTicketDetailEntity> inputTicketDetails = new ArrayList<>();

        public void addInputTicketDetail(InputTicketDetailEntity inputTicketDetailEntity) {
                this.inputTicketDetails.add(inputTicketDetailEntity);
                inputTicketDetailEntity.setInputTicket(this);
        }

        public void removeInputTicketDetail(InputTicketDetailEntity inputTicketDetailEntity) {
                this.inputTicketDetails.remove(inputTicketDetailEntity);
                inputTicketDetailEntity.setInputTicket(null);
        }
}
