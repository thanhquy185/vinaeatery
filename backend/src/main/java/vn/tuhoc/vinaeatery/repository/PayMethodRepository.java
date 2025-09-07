package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.PayMethod;

@Repository
public interface PayMethodRepository extends JpaRepository<PayMethod, Integer>, JpaSpecificationExecutor<PayMethod>  {
    // Methods
    PayMethod findOneById(Integer id);

    void deleteById(Integer id);
}
