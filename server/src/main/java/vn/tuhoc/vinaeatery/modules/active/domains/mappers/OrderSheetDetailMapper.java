package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.OrderSheetDetailCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetDDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.FoodMapperHelper2;

@Mapper(config = CentralMapperConfig.class, uses = {
                FoodMapperHelper2.class
})
public interface OrderSheetDetailMapper {
        OrderSheetDDetailResponseDTO entityToDetailResponse(OrderSheetDetailEntity orderSheetDetailEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id.orderSheetId", ignore = true)
        @Mapping(target = "orderSheet", ignore = true)
        @Mapping(target = "food", source = "foodId")
        @Mapping(target = "quantity", source = "quantity")
        @Mapping(target = "price", source = "price")
        @Mapping(target = "foodNameSnapshot", source = "foodNameSnapshot")
        @Mapping(target = "foodUnitSnapshot", source = "foodUnitSnapshot")
        @Mapping(target = "foodPriceSnapshot", source = "foodPriceSnapshot")
        @Mapping(target = "totalPriceDetail", source = "totalPriceDetail")
        OrderSheetDetailEntity createEntityFromRequest(
                        OrderSheetDetailCreateRequestDTO orderSheetDetailCreateRequestDTO);
}
