package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.ManagerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.ManagerRepository;

@Component
@RequiredArgsConstructor
public class ManagerMapperHelper {
    private final ManagerRepository managerRepository;
    private final ManagerMapper managerMapper;

    public ManagerEntity mapToEntity(Integer id) {
        return this.managerRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new ManagerNotFoundByIdException(id));
    }

    public ManagerDetailResponseDTO mapToDetailResponse(ManagerEntity managerEntity) {
        return this.managerMapper.entityToDetailResponse(managerEntity);
    }

    public ManagerSummaryResponseDTO mapToSummaryResponse(ManagerEntity managerEntity) {
        return this.managerMapper.entityToSummaryResponse(managerEntity);
    }

    public ManagerCrudResponseDTO mapToCrudResponse(ManagerEntity managerEntity) {
        return this.managerMapper.entityToCrudResponse(managerEntity);
    }

    public ManagerInfoResponseDTO mapToInfoResponse(ManagerEntity managerEntity) {
        return this.managerMapper.entityToInfoResponse(managerEntity);
    }
}