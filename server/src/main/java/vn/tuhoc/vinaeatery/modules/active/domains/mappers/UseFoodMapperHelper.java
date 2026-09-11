package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseFoodEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseFoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.UseFoodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.UseFoodRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseFoodMapperHelper {
    final UseFoodRepository useFoodRepository;
    final UseFoodMapper useFoodMapper;

    public UseFoodEntity mapToEntity(Integer id) {
        return this.useFoodRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new UseFoodNotFoundByIdException(id));
    }

    public UseFoodDetailResponseDTO mapToDetailResponse(UseFoodEntity useFoodEntity) {
        return this.useFoodMapper.entityToDetailResponse(useFoodEntity);
    }

    public UseFoodSummaryResponseDTO mapToSummaryResponse(UseFoodEntity useFoodEntity) {
        return this.useFoodMapper.entityToSummaryResponse(useFoodEntity);
    }
}
