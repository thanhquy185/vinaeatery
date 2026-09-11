package vn.tuhoc.vinaeatery.modules.table.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.FloorEntity;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorInfoResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
})
public interface FloorMapper {
        FloorDetailResponseDTO entityToDetailResponse(FloorEntity floorEntity);

        FloorSummaryResponseDTO entityToSummaryResponse(FloorEntity floorEntity);

        FloorCrudResponseDTO entityToCrudResponse(FloorEntity floorEntity);

        FloorInfoResponseDTO entityToInfoResponse(FloorEntity floorEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        FloorEntity createEntityFromRequest(FloorCreateRequestDTO floorCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "status", ignore = true)
        void updateEntityFromRequest(
                        FloorUpdateRequestDTO floorUpdateRequestDTO,
                        @MappingTarget FloorEntity floorEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "description", ignore = true)
        void deleteEntityFromRequest(
                        FloorDeleteRequestDTO floorDeleteRequestDTO,
                        @MappingTarget FloorEntity floorEntity);
}
