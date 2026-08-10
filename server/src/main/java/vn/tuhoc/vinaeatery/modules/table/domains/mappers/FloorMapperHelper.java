package vn.tuhoc.vinaeatery.modules.table.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.FloorEntity;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.exceptions.FloorNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.table.repositories.FloorRepository;

@Component
@RequiredArgsConstructor
public class FloorMapperHelper {
    private final FloorRepository floorRepository;
    private final FloorMapper floorMapper;

    public FloorEntity mapToEntity(Integer id) {
        return this.floorRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new FloorNotFoundByIdException(id));
    }

    public FloorDetailResponseDTO mapToDetailResponse(FloorEntity floorEntity) {
        return this.floorMapper.entityToDetailResponse(floorEntity);
    }

    public FloorSummaryResponseDTO mapToSummaryResponse(FloorEntity floorEntity) {
        return this.floorMapper.entityToSummaryResponse(floorEntity);
    }

    public FloorCrudResponseDTO mapToCrudResponse(FloorEntity floorEntity) {
        return this.floorMapper.entityToCrudResponse(floorEntity);
    }

    public FloorInfoResponseDTO mapToInfoResponse(FloorEntity floorEntity) {
        return this.floorMapper.entityToInfoResponse(floorEntity);
    }
}