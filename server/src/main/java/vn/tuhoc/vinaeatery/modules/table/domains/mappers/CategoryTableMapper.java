package vn.tuhoc.vinaeatery.modules.table.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.CategoryTableEntity;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableCrudResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                RestaurantMapperHelper.class,
})
public interface CategoryTableMapper {
        CategoryTableDetailResponseDTO entityToDetailResponse(CategoryTableEntity categoryTableEntity);

        CategoryTableSummaryResponseDTO entityToSummaryResponse(CategoryTableEntity categoryTableEntity);

        CategoryTableCrudResponseDTO entityToCrudResponse(CategoryTableEntity categoryTableEntity);

        CategoryTableInfoResponseDTO entityToInfoResponse(CategoryTableEntity categoryTableEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        CategoryTableEntity createEntityFromRequest(CategoryTableCreateRequestDTO categoryTableCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "status", ignore = true)
        void updateEntityFromRequest(
                        CategoryTableUpdateRequestDTO categoryTableUpdateRequestDTO,
                        @MappingTarget CategoryTableEntity categoryTableEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "surchargeType", ignore = true)
        @Mapping(target = "surchargeValue", ignore = true)
        @Mapping(target = "description", ignore = true)
        void deleteEntityFromRequest(
                        CategoryTableDeleteRequestDTO categoryTableDeleteRequestDTO,
                        @MappingTarget CategoryTableEntity categoryTableEntity);
}
