package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance;

@Repository
public interface CategoryAllowanceRepository
        extends JpaRepository<CategoryAllowance, Integer>, JpaSpecificationExecutor<CategoryAllowance> {
    // Methods
    CategoryAllowance findOneById(Integer id);

    void deleteById(Integer id);
}
