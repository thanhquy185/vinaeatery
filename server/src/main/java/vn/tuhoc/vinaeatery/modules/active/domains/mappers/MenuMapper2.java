package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.Mapper;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                MenuDetailMapperHelper.class
})
public interface MenuMapper2 {
        MenuInfoResponseDTO entityToInfoResponse(MenuEntity menuEntity);

        MenuCustomerResponseDTO entityToCustomerResponse(MenuEntity menuEntity);
}
