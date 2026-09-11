package vn.tuhoc.vinaeatery.modules.payment.domains.entities;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.converters.PaymentMachineProcessStatusConverter;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineProcessStatusEnum;

@Entity
@Table(name = "payment_machines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMachineEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(columnDefinition = "DATETIME", nullable = false)
    String at;

    @Column(nullable = true)
    Long foodPrice;

    @Column(nullable = true)
    Long categoryTableSurcharge;

    @Column(nullable = true)
    Long customerDiscount;

    @Column(nullable = true)
    Long totalPrice;

    @Column(nullable = true)
    String paymentId;

    @Column(nullable = true)
    Long paymentTotalPrice;

    @Column(columnDefinition = "VARCHAR(9)", nullable = false)
    @Convert(converter = PaymentMachineProcessStatusConverter.class)
    PaymentMachineProcessStatusEnum processStatus;

    @Column(columnDefinition = "VARCHAR(10)", nullable = false)
    @Convert(converter = PaymentMachineStatusConverter.class)
    PaymentMachineStatusEnum status;

    @OneToOne(mappedBy = "paymentMachine", fetch = FetchType.LAZY)
    UseTableEntity useTable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    RestaurantEntity restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_method_id", nullable = false)
    PaymentMethodEntity paymentMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    EmployeeEntity employee;

    @OneToMany(mappedBy = "paymentMachine", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<PaymentMachineFoodEntity> paymentMachineFoods = new ArrayList<>();

    public void addPaymentMachineFood(PaymentMachineFoodEntity paymentMachineFoodEntity) {
        this.paymentMachineFoods.add(paymentMachineFoodEntity);
        paymentMachineFoodEntity.setPaymentMachine(this);
    }

    public void removePaymentMachineFood(PaymentMachineFoodEntity paymentMachineFoodEntity) {
        this.paymentMachineFoods.remove(paymentMachineFoodEntity);
        paymentMachineFoodEntity.setPaymentMachine(null);
    }
}
