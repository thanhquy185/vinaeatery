package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.HandlePayment;

@Repository
public interface HandlePaymentRepository
        extends JpaRepository<HandlePayment, Integer>, JpaSpecificationExecutor<HandlePayment> {
    // Methods
    HandlePayment findOneById(Integer id);

    HandlePayment findOneByUseTableId(Long useTableId);

    void deleteById(Integer id);
}
