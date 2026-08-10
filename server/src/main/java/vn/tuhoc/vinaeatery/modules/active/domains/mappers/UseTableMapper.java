package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.EmployeeMapperHelper;
import vn.tuhoc.vinaeatery.modules.payment.domains.mappers.PaymentMachineMapperHelper2;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.CustomerMapperHelper2;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;
import vn.tuhoc.vinaeatery.modules.table.domains.mappers.TableMapperHelper;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseTableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseTableUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableSummaryResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                RestaurantMapperHelper.class,
                TableMapperHelper.class,
                EmployeeMapperHelper.class,
                PaymentMachineMapperHelper2.class,
                FeedbackMapperHelper2.class,
                MenuMapperHelper2.class,
                MessageMapperHelper2.class,
                BillMapperHelper2.class,
                ReservationMapperHelper2.class,
                CustomerMapperHelper2.class,
})
public interface UseTableMapper {
        @Mapping(target = "orderSheets", ignore = true)
        UseTableDetailResponseDTO entityToDetailResponse(UseTableEntity useTableEntity);

        UseTableSummaryResponseDTO entityToSummaryResponse(UseTableEntity useTableEntity);

        @Mapping(target = "message", ignore = true)
        @Mapping(target = "orderSheets", ignore = true)
        UseTableCustomerResponseDTO entityToCustomerResponse(UseTableEntity useTableEntity);

        UseTableInfoResponseDTO entityToInfoResponse(UseTableEntity useTableEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "table", source = "tableId")
        @Mapping(target = "employee", source = "employeeId")
        @Mapping(target = "customer", source = "customerId")
        @Mapping(target = "menu", source = "menuId")
        @Mapping(target = "bill", source = "billId")
        @Mapping(target = "reservation", source = "reservationId")
        @Mapping(target = "endAt", ignore = true)
        UseTableEntity createEntityFromRequest(UseTableCreateRequestDTO useTableCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "table", ignore = true)
        @Mapping(target = "employee", ignore = true)
        @Mapping(target = "customer", ignore = true)
        @Mapping(target = "menu", ignore = true)
        @Mapping(target = "bill", ignore = true)
        @Mapping(target = "reservation", ignore = true)
        @Mapping(target = "startAt", ignore = true)
        @Mapping(target = "customerFullname", ignore = true)
        @Mapping(target = "customerPhone", ignore = true)
        @Mapping(target = "customerEmail", ignore = true)
        @Mapping(target = "customerAdult", ignore = true)
        @Mapping(target = "customerChild", ignore = true)
        @Mapping(target = "customerGuests", ignore = true)
        @Mapping(target = "status", ignore = true)
        void updateStatusEntityFromRequest(
                        UseTableUpdateStatusRequestDTO useTableUpdateStatusRequestDTO,
                        @MappingTarget UseTableEntity useTableEntity);
}
