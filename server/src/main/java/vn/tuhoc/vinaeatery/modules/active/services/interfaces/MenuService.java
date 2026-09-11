package vn.tuhoc.vinaeatery.modules.active.services.interfaces;

import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.MenuCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;

public interface MenuService {
    MenuDetailResponseDTO handleGetDetailById(Integer id);

    PageResponseDTO<MenuSummaryResponseDTO> handleGetSummary(MenuCriteria menuCriteria);

    MenuDetailResponseDTO handleCreate(MenuCreateRequestDTO menuCreateRequestDTO);

    MenuDetailResponseDTO handleUpdate(Integer id, MenuUpdateRequestDTO menuUpdateRequestDTO);

    MenuDetailResponseDTO handleDelete(Integer id, MenuDeleteRequestDTO menuDeleteRequestDTO);
}
