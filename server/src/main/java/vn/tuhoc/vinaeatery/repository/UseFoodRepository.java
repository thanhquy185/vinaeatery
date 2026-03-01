package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.UseFood;

@Repository
public interface UseFoodRepository extends JpaRepository<UseFood, Long>, JpaSpecificationExecutor<UseFood> {
    // Methods
    UseFood findOneById(Long id);

    void deleteById(Long id);
}
