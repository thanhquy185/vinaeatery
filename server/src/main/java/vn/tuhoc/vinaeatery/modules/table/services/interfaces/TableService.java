package vn.tuhoc.vinaeatery.modules.table.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.TableCriteria;

public interface TableService {
    TableDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<TableSummaryResponseDTO> handleGetSummary(TableCriteria tableCriteria);

    List<TableCrudResponseDTO> handleGetCrud();

    List<TableCrudResponseDTO> handleGetCrud(Integer restaurantId);

    TableDetailResponseDTO handleCreate(TableCreateRequestDTO tableCreateRequestDTO);

    TableDetailResponseDTO handleUpdate(Integer id, TableUpdateRequestDTO tableUpdateRequestDTO);

    TableDetailResponseDTO handleDelete(Integer id, TableDeleteRequestDTO tableDeleteRequestDTO);
}
