package vn.tuhoc.vinaeatery.modules.payment.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineFoodEntity;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineFoodIdEntity;

public interface PaymentMachineFoodRepository
                extends JpaRepository<PaymentMachineFoodEntity, PaymentMachineFoodIdEntity>,
                JpaSpecificationExecutor<PaymentMachineFoodEntity> {

}
