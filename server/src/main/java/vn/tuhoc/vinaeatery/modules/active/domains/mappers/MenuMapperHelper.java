package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.MenuNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.MenuRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MenuMapperHelper {
    final MenuRepository menuRepository;
    final MenuMapper menuMapper;

    public MenuEntity mapToEntity(Integer id) {
        return this.menuRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new MenuNotFoundByIdException(id));
    }

    public MenuDetailResponseDTO mapToDetailResponse(MenuEntity menuEntity) {
        return this.menuMapper.entityToDetailResponse(menuEntity);
    }

    public MenuSummaryResponseDTO mapToSummaryResponse(MenuEntity menuEntity) {
        return this.menuMapper.entityToSummaryResponse(menuEntity);
    }

    public MenuCustomerResponseDTO mapToCustomerResponse(MenuEntity menuEntity) {
        return this.menuMapper.entityToCustomerResponse(menuEntity);
    }

    public MenuInfoResponseDTO mapToInfoResponse(MenuEntity menuEntity) {
        return this.menuMapper.entityToInfoResponse(menuEntity);
    }
}