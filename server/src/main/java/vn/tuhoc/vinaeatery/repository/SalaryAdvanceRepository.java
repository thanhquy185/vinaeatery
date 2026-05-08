package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance;

@Repository
public interface SalaryAdvanceRepository
        extends JpaRepository<SalaryAdvance, Integer>, JpaSpecificationExecutor<SalaryAdvance> {
    // Methods
    SalaryAdvance findOneById(Integer id);

    void deleteById(Integer id);
}
