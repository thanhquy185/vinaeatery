package vn.tuhoc.vinaeatery.modules.table.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableSummaryResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                RestaurantMapperHelper.class,
                FloorMapperHelper.class,
                CategoryTableMapperHelper.class,
})
public interface TableMapper {
        TableDetailResponseDTO entityToDetailResponse(TableEntity tableEntity);

        TableSummaryResponseDTO entityToSummaryResponse(TableEntity tableEntity);

        TableCrudResponseDTO entityToCrudResponse(TableEntity tableEntity);
        
        TableInfoResponseDTO entityToInfoResponse(TableEntity tableEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "floor", source = "floorId")
        @Mapping(target = "categoryTable", source = "categoryTableId")
        TableEntity createEntityFromRequest(TableCreateRequestDTO tableCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "floor", source = "floorId")
        @Mapping(target = "categoryTable", source = "categoryTableId")
        @Mapping(target = "status", ignore = true)
        void updateEntityFromRequest(
                        TableUpdateRequestDTO tableUpdateRequestDTO,
                        @MappingTarget TableEntity tableEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "floor", ignore = true)
        @Mapping(target = "categoryTable", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "seats", ignore = true)
        @Mapping(target = "description", ignore = true)
        void deleteEntityFromRequest(
                        TableDeleteRequestDTO tableDeleteRequestDTO,
                        @MappingTarget TableEntity tableEntity);
}
