package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Insurance;

@Repository
public interface InsuranceRepository extends JpaRepository<Insurance, Integer>, JpaSpecificationExecutor<Insurance> {
    // Methods
    Insurance findOneById(Integer id);

    void deleteById(Integer id);
}