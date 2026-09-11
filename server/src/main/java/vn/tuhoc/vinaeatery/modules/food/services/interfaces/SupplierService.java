package vn.tuhoc.vinaeatery.modules.food.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.SupplierCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface SupplierService {
    SupplierDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<SupplierSummaryResponseDTO> handleGetSummary(SupplierCriteria supplierCriteria);

    List<SupplierCrudResponseDTO> handleGetCrud();

    List<SupplierCrudResponseDTO> handleGetCrud(Integer restaurantId);

    SupplierDetailResponseDTO handleCreate(SupplierCreateRequestDTO supplierCreateRequestDTO);

    SupplierDetailResponseDTO handleUpdate(Integer id, SupplierUpdateRequestDTO supplierUpdateRequestDTO);

    SupplierDetailResponseDTO handleDelete(Integer id, SupplierDeleteRequestDTO supplierDeleteRequestDTO);
}
