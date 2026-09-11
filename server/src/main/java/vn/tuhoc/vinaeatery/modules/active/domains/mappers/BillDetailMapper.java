package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillDetailCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillDDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.FoodMapperHelper;

@Mapper(config = CentralMapperConfig.class, uses = {
                FoodMapperHelper.class })
public interface BillDetailMapper {
        BillDDetailResponseDTO entityToDetailResponse(BillDetailEntity billDetailEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id.billId", ignore = true)
        @Mapping(target = "bill", ignore = true)
        @Mapping(target = "food", source = "foodId")
        @Mapping(target = "quantity", source = "quantity")
        @Mapping(target = "price", source = "price")
        @Mapping(target = "foodNameSnapshot", source = "foodNameSnapshot")
        @Mapping(target = "foodUnitSnapshot", source = "foodUnitSnapshot")
        @Mapping(target = "foodPriceSnapshot", source = "foodPriceSnapshot")
        @Mapping(target = "totalPriceDetail", source = "totalPriceDetail")
        BillDetailEntity createEntityFromRequest(
                        BillDetailCreateRequestDTO billDetailCreateRequestDTO);
}
