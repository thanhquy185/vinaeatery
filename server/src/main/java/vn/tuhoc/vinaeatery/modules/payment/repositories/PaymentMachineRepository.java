package vn.tuhoc.vinaeatery.modules.payment.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;

public interface PaymentMachineRepository
                extends JpaRepository<PaymentMachineEntity, Integer>, JpaSpecificationExecutor<PaymentMachineEntity> {
        @Query("""
                                select distinct pm
                                from PaymentMachineEntity pm
                                where pm.id = :id
                        """)
        Optional<PaymentMachineEntity> findOneByIdToCrud(@Param("id") Integer id);

        @Query("""
                                select distinct pm
                                from PaymentMachineEntity pm
                                left join fetch pm.restaurant
                                left join fetch pm.useTable ut
                                left join fetch ut.table t
                                left join fetch t.floor
                                left join fetch t.categoryTable
                                left join fetch pm.employee
                                left join fetch pm.paymentMethod
                                left join fetch pm.paymentMachineFoods pmf
                                left join fetch pmf.food f
                                left join fetch f.categoryFood
                                where pm.id = :id
                        """)
        Optional<PaymentMachineEntity> findOneById(@Param("id") Integer id);

        @Query("""
                                select distinct pm
                                from PaymentMachineEntity pm
                                left join fetch pm.employee
                                left join fetch pm.paymentMethod
                                left join fetch pm.paymentMachineFoods pmf
                                left join fetch pmf.food f
                                left join fetch f.categoryFood
                                where pm.useTable.id = :useTableId
                        """)
        Optional<PaymentMachineEntity> findOneByUseTableId(@Param("useTableId") Integer useTableId);

        @Query("""
                                select distinct pm
                                from PaymentMachineEntity pm
                                left join fetch pm.paymentMethod
                                left join fetch pm.paymentMachineFoods pmf
                                left join fetch pmf.food f
                                left join fetch f.categoryFood
                                where pm.paymentId = :paymentId
                        """)
        Optional<PaymentMachineEntity> findOneByPaymentId(@Param("paymentId") String paymentId);

        @Query("""
                                select distinct pm
                                from PaymentMachineEntity pm
                                left join fetch pm.useTable ut
                                left join fetch ut.table t
                                left join fetch t.floor
                                left join fetch t.categoryTable
                                where pm.status = vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineStatusEnum.PROCESSING
                        """)
        PaymentMachineEntity findOneIsHandling();
}
