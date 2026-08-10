package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuDDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuDetailCustomerResponseDTO;

@Component
@RequiredArgsConstructor
public class MenuDetailMapperHelper {
    private final MenuDetailMapper menuDetailMapper;

    public MenuDDetailResponseDTO mapToDetailResponse(MenuDetailEntity menuDetailEntity) {
        return this.menuDetailMapper.entityToDetailResponse(menuDetailEntity);
    }

    public MenuDetailCustomerResponseDTO mapToCustomerResponse(MenuDetailEntity menuDetailEntity) {
        return this.menuDetailMapper.entityToCustomerResponse(menuDetailEntity);

    }
}