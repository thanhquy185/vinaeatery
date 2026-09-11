package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.UseTableNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.UseTableRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseTableMapperHelper {
    final UseTableRepository useTableRepository;
    final UseTableMapper useTableMapper;

    public UseTableEntity mapToEntity(Long id) {
        return this.useTableRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new UseTableNotFoundByIdException(id));
    }

    public UseTableDetailResponseDTO mapToDetailResponse(UseTableEntity useTableEntity) {
        return this.useTableMapper.entityToDetailResponse(useTableEntity);
    }

    public UseTableSummaryResponseDTO mapToSummaryResponse(UseTableEntity useTableEntity) {
        return this.useTableMapper.entityToSummaryResponse(useTableEntity);
    }

    public UseTableCustomerResponseDTO mapToCustomerResponse(UseTableEntity useTableEntity) {
        return this.useTableMapper.entityToCustomerResponse(useTableEntity);
    }

    public UseTableInfoResponseDTO mapToInfoResponse(UseTableEntity useTableEntity) {
        return this.useTableMapper.entityToInfoResponse(useTableEntity);
    }
}
