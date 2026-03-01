package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket;

@Repository
public interface CategoryPermissionTicketRepository
        extends JpaRepository<CategoryPermissionTicket, Integer>, JpaSpecificationExecutor<CategoryPermissionTicket> {
    // Methods
    CategoryPermissionTicket findOneById(Integer id);

    void deleteById(Integer id);
}
