package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Allowance;

@Repository
public interface AllowanceRepository extends JpaRepository<Allowance, Integer>, JpaSpecificationExecutor<Allowance> {
    // Methods
    Allowance findOneById(Integer id);

    void deleteById(Integer id);
}