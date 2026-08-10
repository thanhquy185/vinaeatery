package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.EmployeeMapperHelper;
import vn.tuhoc.vinaeatery.modules.payment.domains.mappers.PaymentMethodMapperHelper;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.CustomerMapperHelper;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillSummaryResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                RestaurantMapperHelper.class,
                EmployeeMapperHelper.class,
                CustomerMapperHelper.class,
                PaymentMethodMapperHelper.class,
                BillDetailMapperHelper.class
})
public interface BillMapper {
        BillDetailResponseDTO entityToDetailResponse(BillEntity billEntity);

        BillSummaryResponseDTO entityToSummaryResponse(BillEntity billEntity);

        BillCustomerResponseDTO entityToCustomerResponse(BillEntity billEntity);

        BillInfoResponseDTO entityToInfoResponse(BillEntity billEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "employee", source = "employeeId")
        @Mapping(target = "customer", source = "customerId")
        @Mapping(target = "paymentMethod", source = "paymentMethodId")
        @Mapping(target = "billDetails", ignore = true)
        BillEntity createEntityFromRequest(BillCreateRequestDTO billCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "employee", ignore = true)
        @Mapping(target = "customer", ignore = true)
        @Mapping(target = "paymentMethod", ignore = true)
        @Mapping(target = "createAt", ignore = true)
        @Mapping(target = "customerFullname", ignore = true)
        @Mapping(target = "customerPhone", ignore = true)
        @Mapping(target = "customerEmail", ignore = true)
        @Mapping(target = "totalPrice", ignore = true)
        @Mapping(target = "paymentId", ignore = true)
        @Mapping(target = "paymentAt", ignore = true)
        @Mapping(target = "paymentTotalPrice", ignore = true)
        @Mapping(target = "paymentStatus", ignore = true)
        @Mapping(target = "billDetails", ignore = true)
        void updateStatusEntityFromRequest(
                        BillUpdateStatusRequestDTO billUpdateStatusRequestDTO,
                        @MappingTarget BillEntity billEntity);
}
