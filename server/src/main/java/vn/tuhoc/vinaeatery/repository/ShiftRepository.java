package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Shift;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Integer>, JpaSpecificationExecutor<Shift> {
    // Methods
    Shift findOneById(Integer id);

    void deleteById(Integer id);
}