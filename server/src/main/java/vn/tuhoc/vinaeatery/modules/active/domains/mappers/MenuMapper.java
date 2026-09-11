package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;
import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.MenuUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MenuSummaryResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
                MenuDetailMapperHelper.class
})
public interface MenuMapper {
        MenuDetailResponseDTO entityToDetailResponse(MenuEntity menuEntity);

        MenuSummaryResponseDTO entityToSummaryResponse(MenuEntity menuEntity);

        MenuCustomerResponseDTO entityToCustomerResponse(MenuEntity menuEntity);

        MenuInfoResponseDTO entityToInfoResponse(MenuEntity menuEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "menuDetails", ignore = true)
        MenuEntity createEntityFromRequest(MenuCreateRequestDTO menuCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "status", ignore = true)
        @Mapping(target = "menuDetails", ignore = true)
        void updateStatusEntityFromRequest(
                        MenuUpdateRequestDTO menuUpdateRequestDTO,
                        @MappingTarget MenuEntity menuEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "type", ignore = true)
        @Mapping(target = "price", ignore = true)
        @Mapping(target = "description", ignore = true)
        @Mapping(target = "menuDetails", ignore = true)
        void deleteEntityFromRequest(
                        MenuDeleteRequestDTO menuDeleteRequestDTO,
                        @MappingTarget MenuEntity menuEntity);
}
