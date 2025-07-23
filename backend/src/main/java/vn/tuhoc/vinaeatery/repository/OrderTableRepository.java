package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.OrderTable;

@Repository
public interface OrderTableRepository
        extends JpaRepository<OrderTable, Integer>, JpaSpecificationExecutor<OrderTable> {
    // Methods
    OrderTable findOneById(Integer id);

    void deleteById(Integer id);
}