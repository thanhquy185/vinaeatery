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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillPaymentStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.BillStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMethodEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "bills")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@NamedEntityGraph(name = "BillEntity.half", attributeNodes = {
                @NamedAttributeNode("restaurant"),
                @NamedAttributeNode("employee"),
                @NamedAttributeNode("customer"),
                @NamedAttributeNode("paymentMethod"),
})
@NamedEntityGraph(name = "BillEntity.onlyPaymentMethod", attributeNodes = {
                @NamedAttributeNode("paymentMethod"),
})
public class BillEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @Column(columnDefinition = "DATETIME", nullable = false)
        private String createAt;

        @Column(nullable = false)
        private String customerFullname;

        @Column(columnDefinition = "VARCHAR(11)", nullable = false)
        private String customerPhone;

        @Column(nullable = false)
        private String customerEmail;

        @Column(nullable = false)
        private Long totalPrice;

        @Column(columnDefinition = "VARCHAR(9)", nullable = false)
        @Convert(converter = BillStatusConverter.class)
        private BillStatusEnum status;

        @Column(nullable = false)
        private String paymentId;

        @Column(columnDefinition = "DATETIME", nullable = false)
        private String paymentAt;

        @Column(nullable = false)
        private Long paymentTotalPrice;

        @Column(columnDefinition = "VARCHAR(6)", nullable = false)
        @Convert(converter = BillPaymentStatusConverter.class)
        private BillPaymentStatusEnum paymentStatus;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "restaurant_id", nullable = false)
        private RestaurantEntity restaurant;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "employee_id", nullable = false)
        private EmployeeEntity employee;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "customer_id", nullable = false)
        private CustomerEntity customer;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "payment_method_id", nullable = false)
        private PaymentMethodEntity paymentMethod;

        @OneToMany(mappedBy = "bill", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @Builder.Default
        List<BillDetailEntity> billDetails = new ArrayList<>();

        public void addBillDetail(BillDetailEntity billDetailEntity) {
                this.billDetails.add(billDetailEntity);
                billDetailEntity.setBill(this);
        }

        public void removeBillDetail(BillDetailEntity billDetailEntity) {
                this.billDetails.remove(billDetailEntity);
                billDetailEntity.setBill(null);
        }
}
