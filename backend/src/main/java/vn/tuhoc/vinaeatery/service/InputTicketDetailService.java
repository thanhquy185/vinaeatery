package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.InputTicketDetail;
import vn.tuhoc.vinaeatery.domain.InputTicketDetailId;
import vn.tuhoc.vinaeatery.repository.InputTicketDetailRepository;

@Service
@RequiredArgsConstructor
public class InputTicketDetailService {
    // Properties
    private final InputTicketDetailRepository inputTicketDetailRepository;

    // Methods
    public InputTicketDetail getOneById(InputTicketDetailId id) {
        return this.inputTicketDetailRepository.findOneById(id);
    }

    public List<InputTicketDetail> getAll() {
        return this.inputTicketDetailRepository.findAll();
    }

    public List<InputTicketDetail> getAllByInputTicketId(Integer inputTicketId) {
        return this.inputTicketDetailRepository.findAllByInputTicketId(inputTicketId);
    }

    public InputTicketDetail upsert(InputTicketDetail InputTicketDetail) {
        return this.inputTicketDetailRepository.save(InputTicketDetail);
    }
}