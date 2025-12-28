package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.InputTicketDetail;
import vn.tuhoc.vinaeatery.domain.entity.InputTicketDetailId;

@Repository
public interface InputTicketDetailRepository
        extends JpaRepository<InputTicketDetail, InputTicketDetailId>, JpaSpecificationExecutor<InputTicketDetail> {
    // Methods
    InputTicketDetail findOneById(InputTicketDetailId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.input_ticket_details WHERE input_ticket_id = :input_ticket_id", nativeQuery = true)
    List<InputTicketDetail> findAllByInputTicketId(@Param("input_ticket_id") Integer inputTicketId);

    void deleteById(InputTicketDetailId id);
}
