package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.UseTableMapperHelper;
import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.EmployeeMapperHelper;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.PaymentMachineCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.PaymentMachineUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
                UseTableMapperHelper.class,
                EmployeeMapperHelper.class,
                PaymentMethodMapperHelper.class,
                PaymentMachineFoodMapperHelper.class
})
public interface PaymentMachineMapper {
        PaymentMachineDetailResponseDTO entityToDetailResponse(PaymentMachineEntity payMethodEntity);

        PaymentMachineInfoResponseDTO entityToInfoResponse(PaymentMachineEntity payMethodEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "paymentMethod", ignore = true)
        @Mapping(target = "employee", source = "employeeId")
        @Mapping(target = "paymentMachineFoods", ignore = true)
        PaymentMachineEntity createEntityFromRequest(PaymentMachineCreateRequestDTO paymentMachineCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "paymentMethod", source = "paymentMethodId")
        @Mapping(target = "employee", ignore = true)
        @Mapping(target = "at", ignore = true)
        @Mapping(target = "paymentId", ignore = true)
        @Mapping(target = "paymentMachineFoods", ignore = true)
        void updateEntityFromRequest(
                        PaymentMachineUpdateRequestDTO paymentMachineUpdateRequestDTO,
                        @MappingTarget PaymentMachineEntity paymentMachineEntity);
}
