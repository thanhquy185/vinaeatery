package vn.tuhoc.vinaeatery.modules.table.services.interfaces;

import java.util.List;

import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.FloorCriteria;

public interface FloorService {
    FloorDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<FloorSummaryResponseDTO> handleGetSummary(FloorCriteria floorCriteria);

    List<FloorCrudResponseDTO> handleGetCrud();

    List<FloorCrudResponseDTO> handleGetCrud(Integer restaurantId);

    FloorDetailResponseDTO handleCreate(FloorCreateRequestDTO floorCreateRequestDTO);

    FloorDetailResponseDTO handleUpdate(Integer id, FloorUpdateRequestDTO floorUpdateRequestDTO);

    FloorDetailResponseDTO handleDelete(Integer id, FloorDeleteRequestDTO floorDeleteRequestDTO);
}
