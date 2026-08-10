package vn.tuhoc.vinaeatery.modules.payment.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMethodEntity;

public interface PaymentMethodRepository
                extends JpaRepository<PaymentMethodEntity, Integer>, JpaSpecificationExecutor<PaymentMethodEntity> {
        @Query("""
                                select distinct pm
                                from PaymentMethodEntity pm
                                where pm.id = :id
                        """)
        Optional<PaymentMethodEntity> findOneByIdToCrud(@Param("id") Integer id);

        @Query("""
                                select distinct pm
                                from PaymentMethodEntity pm
                                where pm.id = :id
                        """)
        Optional<PaymentMethodEntity> findOneById(@Param("id") Integer id);
}
