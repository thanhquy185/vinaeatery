package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.EmployeeMapperHelper;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.OrderSheetCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.OrderSheetUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetSummaryResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                RestaurantMapperHelper.class,
                UseTableMapperHelper.class,
                EmployeeMapperHelper.class,
                OrderSheetDetailMapperHelper.class
})
public interface OrderSheetMapper {
        OrderSheetDetailResponseDTO entityToDetailResponse(OrderSheetEntity orderSheetEntity);

        OrderSheetSummaryResponseDTO entityToSummaryResponse(OrderSheetEntity orderSheetEntity);

        OrderSheetInfoResponseDTO entityToInfoResponse(OrderSheetEntity orderSheetEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "useTable", source = "useTableId")
        @Mapping(target = "employee", ignore = true)
        @Mapping(target = "orderSheetDetails", ignore = true)
        OrderSheetEntity createEntityFromRequest(OrderSheetCreateRequestDTO orderSheetCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "useTable", ignore = true)
        @Mapping(target = "employee", ignore = true)
        @Mapping(target = "createAt", ignore = true)
        @Mapping(target = "totalPrice", ignore = true)
        @Mapping(target = "note", ignore = true)
        @Mapping(target = "orderSheetDetails", ignore = true)
        void updateStatusEntityFromRequest(
                        OrderSheetUpdateStatusRequestDTO orderSheetUpdateStatusRequestDTO,
                        @MappingTarget OrderSheetEntity orderSheetEntity);
}
