package vn.tuhoc.vinaeatery.modules.table.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.CategoryTableCriteria;

public interface CategoryTableService {
    CategoryTableDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<CategoryTableSummaryResponseDTO> handleGetSummary(
            CategoryTableCriteria categoryTableCriteria);

    List<CategoryTableCrudResponseDTO> handleGetCrud();

    List<CategoryTableCrudResponseDTO> handleGetCrud(Integer restaurantId);

    CategoryTableDetailResponseDTO handleCreate(CategoryTableCreateRequestDTO categoryTableCreateRequestDTO);

    CategoryTableDetailResponseDTO handleUpdate(
            Integer id,
            CategoryTableUpdateRequestDTO categoryTableUpdateRequestDTO);

    CategoryTableDetailResponseDTO handleDelete(
            Integer id,
            CategoryTableDeleteRequestDTO categoryTableDeleteRequestDTO);
}
