package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.entity.PayMethod;
import vn.tuhoc.vinaeatery.repository.PayMethodRepository;

@Service
@RequiredArgsConstructor
public class PayMethodService {
    // Properties
    private final PayMethodRepository payMethodRepository;

    // Methods
    public PayMethod getOneById(Integer id) {
        return this.payMethodRepository.findOneById(id);
    }

    public List<PayMethod> getAll() {
        return this.payMethodRepository.findAll();
    }
}
