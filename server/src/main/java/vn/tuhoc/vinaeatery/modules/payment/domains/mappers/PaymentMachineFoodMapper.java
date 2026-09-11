package vn.tuhoc.vinaeatery.modules.payment.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineFoodEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.PaymentMachineFoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.FoodMapperHelper2;

@Mapper(config = CentralMapperConfig.class, uses = {
                FoodMapperHelper2.class
})
public interface PaymentMachineFoodMapper {
        PaymentMachineFoodDetailResponseDTO entityToDetailResponse(PaymentMachineFoodEntity paymentMachineFoodEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id.paymentMachineId", ignore = true)
        @Mapping(target = "paymentMachine", ignore = true)
        @Mapping(target = "food", source = "foodId")
        @Mapping(target = "quantity", source = "quantity")
        @Mapping(target = "price", source = "price")
        @Mapping(target = "foodNameSnapshot", source = "foodNameSnapshot")
        @Mapping(target = "foodUnitSnapshot", source = "foodUnitSnapshot")
        @Mapping(target = "foodPriceSnapshot", source = "foodPriceSnapshot")
        @Mapping(target = "totalPriceDetail", source = "totalPriceDetail")
        PaymentMachineFoodEntity createEntityFromRequest(
                        PaymentMachineFoodCreateRequestDTO paymentMachineFoodCreateRequestDTO);
}
