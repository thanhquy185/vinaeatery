package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.HandlePayment;
import java.util.List;


@Repository
public interface HandlePaymentRepository
        extends JpaRepository<HandlePayment, Integer>, JpaSpecificationExecutor<HandlePayment> {
    // Methods
    HandlePayment findOneById(Integer id);

    HandlePayment findOneByUseTableId(Long useTableId);

    HandlePayment findOneByIsEmployeeHandle(Boolean isEmployeeHandle);

    HandlePayment findOneByIsEmployeeHandleAndIsHandling(Boolean isEmployeeHandle, Boolean isHandling);

    void deleteById(Integer id);
}
