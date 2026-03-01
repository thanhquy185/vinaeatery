package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.PermissionTicket;

@Repository
public interface PermissionTicketRepository
        extends JpaRepository<PermissionTicket, Integer>, JpaSpecificationExecutor<PermissionTicket> {
    // Methods
    PermissionTicket findOneById(Integer id);

    List<PermissionTicket> findAllByCategoryPermissionTicketId(Integer categoryPermissionTicketId);

    void deleteById(Integer id);
}
