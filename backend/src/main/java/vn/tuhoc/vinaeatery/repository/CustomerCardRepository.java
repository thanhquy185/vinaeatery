package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.CustomerCard;

@Repository
public interface CustomerCardRepository
        extends JpaRepository<CustomerCard, Integer>, JpaSpecificationExecutor<CustomerCard> {
    // Methods
    CustomerCard findOneById(Integer id);

    @Query(value = "SELECT * FROM vinaeatery.customer_cards ORDER BY id DESC LIMIT 1", nativeQuery = true)
    CustomerCard findLastOne();

    void deleteById(Integer id);
}
