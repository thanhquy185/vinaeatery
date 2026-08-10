package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.FunctionEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.FunctionDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.FunctionSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.repositories.FunctionRepository;

@Component
@RequiredArgsConstructor
public class FunctionMapperHelper {
    private final FunctionRepository functionRepository;
    private final FunctionMapper functionMapper;

    public FunctionEntity mapToEntity(Integer id) {
        return this.functionRepository.findById(id).get();
    }

    public FunctionDetailResponseDTO mapToDetailResponse(FunctionEntity functionEntity) {
        return this.functionMapper.entityToDetailResponse(functionEntity);
    }

    public FunctionSummaryResponseDTO mapToSummaryResponse(FunctionEntity functionEntity) {
        return this.functionMapper.entityToSummaryResponse(functionEntity);
    }
}