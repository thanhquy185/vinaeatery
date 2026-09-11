package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuDetailCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuDetailUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuDDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuDetailCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.FoodMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                FoodMapperHelper.class
})
public interface MenuDetailMapper {
        MenuDDetailResponseDTO entityToDetailResponse(MenuDetailEntity menuDetailEntity);

        MenuDetailCustomerResponseDTO entityToCustomerResponse(MenuDetailEntity menuDetailEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id.menuId", ignore = true)
        @Mapping(target = "menu", ignore = true)
        @Mapping(target = "food", source = "foodId")
        MenuDetailEntity createEntityFromRequest(
                        MenuDetailCreateRequestDTO menuDetailCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id.menuId", ignore = true)
        @Mapping(target = "menu", ignore = true)
        @Mapping(target = "food", source = "foodId")
        MenuDetailEntity updateEntityFromRequest(
                        MenuDetailUpdateRequestDTO menuDetailUpdateRequestDTO);
}
