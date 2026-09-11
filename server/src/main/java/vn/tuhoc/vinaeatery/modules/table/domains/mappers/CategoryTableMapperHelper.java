package vn.tuhoc.vinaeatery.modules.table.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.CategoryTableEntity;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.exceptions.CategoryTableNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.table.repositories.CategoryTableRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryTableMapperHelper {
    final CategoryTableRepository categoryTableRepository;
    final CategoryTableMapper categoryTableMapper;

    public CategoryTableEntity mapToEntity(Integer id) {
        return this.categoryTableRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new CategoryTableNotFoundByIdException(id));
    }

    public CategoryTableDetailResponseDTO mapToDetailResponse(CategoryTableEntity categoryTableEntity) {
        return this.categoryTableMapper.entityToDetailResponse(categoryTableEntity);
    }

    public CategoryTableSummaryResponseDTO mapToSummaryResponse(CategoryTableEntity categoryTableEntity) {
        return this.categoryTableMapper.entityToSummaryResponse(categoryTableEntity);
    }

    public CategoryTableCrudResponseDTO mapToCrudResponse(CategoryTableEntity categoryTableEntity) {
        return this.categoryTableMapper.entityToCrudResponse(categoryTableEntity);
    }

    public CategoryTableInfoResponseDTO mapToInfoResponse(CategoryTableEntity categoryTableEntity) {
        return this.categoryTableMapper.entityToInfoResponse(categoryTableEntity);
    }
}