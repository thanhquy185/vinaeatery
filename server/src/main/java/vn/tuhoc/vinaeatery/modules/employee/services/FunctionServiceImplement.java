package vn.tuhoc.vinaeatery.modules.employee.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.FunctionEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.FunctionMapper;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.FunctionDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.FunctionSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.FunctionNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.repositories.FunctionRepository;
import vn.tuhoc.vinaeatery.modules.employee.services.interfaces.FunctionService;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FunctionServiceImplement implements FunctionService {
    FunctionRepository functionRepository;
    FunctionMapper functionMapper;

    private FunctionEntity getOneById(Integer id) {
        return this.functionRepository.findById(id)
                .orElseThrow(() -> new FunctionNotFoundByIdException(id));
    }

    private List<FunctionEntity> getAll() {
        return this.functionRepository.findAll();
    }

    @Override
    @Cacheable(value = "function__detail", key = "#id", unless = "#result == null")
    public FunctionDetailResponseDTO handleGetDetailById(Integer id) {
        return this.functionMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    @Cacheable(value = "function__summary", unless = "#result == null")
    public List<FunctionSummaryResponseDTO> handleGetSummary() {
        return this.getAll().stream()
                .map(this.functionMapper::entityToSummaryResponse)
                .collect(Collectors.toList());
    }
}