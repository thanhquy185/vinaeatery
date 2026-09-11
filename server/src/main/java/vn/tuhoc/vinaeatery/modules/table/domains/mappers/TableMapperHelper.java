package vn.tuhoc.vinaeatery.modules.table.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.exceptions.TableNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.table.repositories.TableRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableMapperHelper {
    final TableRepository tableRepository;
    final TableMapper tableMapper;

    public TableEntity mapToEntity(Integer id) {
        return this.tableRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new TableNotFoundByIdException(id));
    }

    public TableDetailResponseDTO mapToDetailResponse(TableEntity tableEntity) {
        return this.tableMapper.entityToDetailResponse(tableEntity);
    }

    public TableSummaryResponseDTO mapToSummaryResponse(TableEntity tableEntity) {
        return this.tableMapper.entityToSummaryResponse(tableEntity);
    }

    public TableCrudResponseDTO mapToCrudResponse(TableEntity tableEntity) {
        return this.tableMapper.entityToCrudResponse(tableEntity);
    }

    public TableInfoResponseDTO mapToInfoResponse(TableEntity tableEntity) {
        return this.tableMapper.entityToInfoResponse(tableEntity);
    }
}