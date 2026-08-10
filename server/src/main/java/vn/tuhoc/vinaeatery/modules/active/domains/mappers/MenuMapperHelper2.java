package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.repositories.MenuRepository;

@Component
@RequiredArgsConstructor
public class MenuMapperHelper2 {
    private final MenuRepository menuRepository;
    private final MenuMapper2 menuMapper2;

    public MenuEntity mapToEntity(Integer id) {
        return this.menuRepository.findOneByIdToCrud(id).orElse(null);
    }

    public MenuInfoResponseDTO mapToInfoResponse(MenuEntity menuEntity) {
        return this.menuMapper2.entityToInfoResponse(menuEntity);
    }

    public MenuCustomerResponseDTO mapToCustomerResponse(MenuEntity menuEntity) {
        return this.menuMapper2.entityToCustomerResponse(menuEntity);
    }
}