package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.InputTicket;

@Repository
public interface InputTicketRepository  extends JpaRepository<InputTicket, Integer>, JpaSpecificationExecutor<InputTicket> {
     // Methods
    InputTicket findOneById(Integer id);

    void deleteById(Integer id);
}
