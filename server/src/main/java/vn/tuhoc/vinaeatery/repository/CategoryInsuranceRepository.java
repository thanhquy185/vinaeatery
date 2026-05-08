package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance;

@Repository
public interface CategoryInsuranceRepository
        extends JpaRepository<CategoryInsurance, Integer>, JpaSpecificationExecutor<CategoryInsurance> {
    // Methods
    CategoryInsurance findOneById(Integer id);

    void deleteById(Integer id);
}
