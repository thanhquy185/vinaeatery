package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.SupplierEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
})
public interface SupplierMapper {
        SupplierDetailResponseDTO entityToDetailResponse(SupplierEntity supplierEntity);

        SupplierSummaryResponseDTO entityToSummaryResponse(SupplierEntity supplierEntity);

        SupplierCrudResponseDTO entityToCrudResponse(SupplierEntity supplierEntity);

        SupplierInfoResponseDTO entityToInfoResponse(SupplierEntity supplierEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        SupplierEntity createEntityFromRequest(SupplierCreateRequestDTO supplierCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "status", ignore = true)
        void updateEntityFromRequest(
                        SupplierUpdateRequestDTO supplierUpdateRequestDTO,
                        @MappingTarget SupplierEntity supplierEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "fullname", ignore = true)
        @Mapping(target = "phone", ignore = true)
        @Mapping(target = "email", ignore = true)
        @Mapping(target = "houseNumber", ignore = true)
        @Mapping(target = "streetName", ignore = true)
        @Mapping(target = "ward", ignore = true)
        @Mapping(target = "province", ignore = true)
        void deleteEntityFromRequest(
                        SupplierDeleteRequestDTO supplierDeleteRequestDTO,
                        @MappingTarget SupplierEntity supplierEntity);
}
