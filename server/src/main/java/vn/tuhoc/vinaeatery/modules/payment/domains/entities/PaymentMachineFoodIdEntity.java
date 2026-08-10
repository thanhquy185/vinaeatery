package vn.tuhoc.vinaeatery.modules.payment.domains.entities;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class PaymentMachineFoodIdEntity implements Serializable {
    private Integer paymentMachineId;

    private Integer foodId;
}
