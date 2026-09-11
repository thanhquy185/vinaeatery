package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.ReservationEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationCustomerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.ReservationUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.ReservationSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.EmployeeMapperHelper;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.CustomerMapperHelper;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
                EmployeeMapperHelper.class,
                CustomerMapperHelper.class
})
public interface ReservationMapper {
        ReservationDetailResponseDTO entityToDetailResponse(ReservationEntity reservationEntity);

        ReservationSummaryResponseDTO entityToSummaryResponse(ReservationEntity reservationEntity);

        ReservationCustomerResponseDTO entityToCustomerResponse(ReservationEntity reservationEntity);

        ReservationCrudResponseDTO entityToCrudResponse(ReservationEntity reservationEntity);

        ReservationInfoResponseDTO entityToInfoResponse(ReservationEntity reservationEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "employee", source = "employeeId")
        @Mapping(target = "customer", source = "customerId")
        ReservationEntity createEntityFromRequest(ReservationCreateRequestDTO reservationCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "employee", ignore = true)
        @Mapping(target = "customer", source = "customerId")
        ReservationEntity createEntityFromCustomerRequest(
                        ReservationCustomerCreateRequestDTO reservationCustomerCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "employee", expression = """
                                java(reservationUpdateStatusRequestDTO.getEmployeeId() != null
                                        ? employeeMapperHelper.mapToEntity(reservationUpdateStatusRequestDTO.getEmployeeId())
                                        : reservationEntity.getEmployee())
                        """)
        @Mapping(target = "customer", ignore = true)
        @Mapping(target = "createAt", ignore = true)
        @Mapping(target = "arriveAt", ignore = true)
        @Mapping(target = "customerFullname", ignore = true)
        @Mapping(target = "customerPhone", ignore = true)
        @Mapping(target = "customerEmail", ignore = true)
        @Mapping(target = "customerGuests", ignore = true)
        @Mapping(target = "customerNote", ignore = true)
        void updateStatusEntityFromRequest(
                        ReservationUpdateStatusRequestDTO reservationUpdateStatusRequestDTO,
                        @MappingTarget ReservationEntity reservationEntity);
}
