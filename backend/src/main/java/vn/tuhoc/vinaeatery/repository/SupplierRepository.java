package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Supplier;

@Repository
public interface SupplierRepository
        extends JpaRepository<Supplier, Integer>, JpaSpecificationExecutor<Supplier> {
    // Methods
    Supplier findOneById(Integer id);

    void deleteById(Integer id);
}