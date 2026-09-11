package vn.tuhoc.vinaeatery.modules.active.domains.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.EmployeeMapperHelper;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.FoodMapperHelper2;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapperHelper;
import vn.tuhoc.vinaeatery.configs.CentralMapperConfig;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseFoodEntity;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseFoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseFoodUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseFoodSummaryResponseDTO;

@Mapper(config = CentralMapperConfig.class, uses = {
                RestaurantMapperHelper.class,
                FoodMapperHelper2.class,
                EmployeeMapperHelper.class,
})
public interface UseFoodMapper {
        UseFoodDetailResponseDTO entityToDetailResponse(UseFoodEntity useFoodEntity);

        UseFoodSummaryResponseDTO entityToSummaryResponse(UseFoodEntity useFoodEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", source = "restaurantId")
        @Mapping(target = "food", source = "foodId")
        @Mapping(target = "employee", source = "employeeId")
        @Mapping(target = "endAt", ignore = true)
        UseFoodEntity createEntityFromRequest(UseFoodCreateRequestDTO useFoodCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "restaurant", ignore = true)
        @Mapping(target = "food", ignore = true)
        @Mapping(target = "employee", ignore = true)
        @Mapping(target = "startAt", ignore = true)
        @Mapping(target = "status", ignore = true)
        void updateStatusEntityFromRequest(
                        UseFoodUpdateStatusRequestDTO useFoodUpdateStatusRequestDTO,
                        @MappingTarget UseFoodEntity useFoodEntity);
}
