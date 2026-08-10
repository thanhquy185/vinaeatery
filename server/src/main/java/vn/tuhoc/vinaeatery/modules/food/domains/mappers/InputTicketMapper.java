package vn.tuhoc.vinaeatery.modules.food.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.EmployeeMapperHelper;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketEntity;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketUpdatePaymentStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                RestaurantMapperHelper.class,
                EmployeeMapperHelper.class,
                SupplierMapperHelper.class,
                InputTicketDetailMapperHelper.class
})
public interface InputTicketMapper {
        InputTicketDetailResponseDTO entityToDetailResponse(InputTicketEntity inputTicketEntity);

        InputTicketSummaryResponseDTO entityToSummaryResponse(InputTicketEntity inputTicketEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "employee", source = "employeeId")
        @Mapping(target = "supplier", source = "supplierId")
        @Mapping(target = "inputTicketDetails", ignore = true)
        InputTicketEntity createEntityFromRequest(InputTicketCreateRequestDTO inputTicketCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "employee", ignore = true)
        @Mapping(target = "supplier", ignore = true)
        @Mapping(target = "createAt", ignore = true)
        @Mapping(target = "totalInputPrice", ignore = true)
        @Mapping(target = "status", ignore = true)
        @Mapping(target = "inputTicketDetails", ignore = true)
        void updatePaymentStatusEntityFromRequest(
                        InputTicketUpdatePaymentStatusRequestDTO inputTicketUpdatePaymentStatusRequestDTO,
                        @MappingTarget InputTicketEntity inputTicketEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "employee", ignore = true)
        @Mapping(target = "supplier", ignore = true)
        @Mapping(target = "createAt", ignore = true)
        @Mapping(target = "totalInputPrice", ignore = true)
        @Mapping(target = "paymentStatus", ignore = true)
        @Mapping(target = "inputTicketDetails", ignore = true)
        void updateStatusEntityFromRequest(
                        InputTicketUpdateStatusRequestDTO inputTicketUpdateStatusRequestDTO,
                        @MappingTarget InputTicketEntity inputTicketEntity);
}
