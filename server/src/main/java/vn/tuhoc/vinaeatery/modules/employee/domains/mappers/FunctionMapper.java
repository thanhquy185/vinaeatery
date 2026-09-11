package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.FunctionEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.FunctionDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.FunctionSummaryResponseDTO;

@Mapper(config = CentralMapperConfig.class)
public interface FunctionMapper {
        FunctionDetailResponseDTO entityToDetailResponse(FunctionEntity functionEntity);

        FunctionSummaryResponseDTO entityToSummaryResponse(FunctionEntity functionEntity);
}
