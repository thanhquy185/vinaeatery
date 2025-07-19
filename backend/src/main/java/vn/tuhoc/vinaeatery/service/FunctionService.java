package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Function;
import vn.tuhoc.vinaeatery.repository.FunctionRepository;

@Service
@AllArgsConstructor
public class FunctionService {
    // Properties
    private final FunctionRepository functionRepository;

    // Methods
    public Function getOneById(Integer id) {
        return this.functionRepository.findOneById(id);
    }

    public List<Function> getAll() {
        return this.functionRepository.findAll();
    }
}