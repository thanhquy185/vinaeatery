package vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.tuhoc.vinaeatery.modules.food.domains.mappers.FoodMapperHelper2;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantManagerResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantPublicDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantPublicResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSummaryResponseDTO;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
                ManagerMapperHelper.class,
                RestaurantImageMapperHelper.class,
                FoodMapperHelper2.class
})
public interface RestaurantMapper {
        RestaurantDetailResponseDTO entityToDetailResponse(RestaurantEntity restaurantEntity);

        RestaurantSummaryResponseDTO entityToSummaryResponse(RestaurantEntity restaurantEntity);

        @Mapping(target = "thumbnail", expression = """
                            java(
                                restaurantEntity.getRestaurantImages() != null
                                && !restaurantEntity.getRestaurantImages().isEmpty()
                                ? restaurantEntity.getRestaurantImages().get(0).getId().getImage()
                                : null
                            )
                        """)
        RestaurantPublicResponseDTO entityToPublicResponse(RestaurantEntity restaurantEntity);

        @Mapping(target = "thumbnail", expression = """
                            java(
                                restaurantEntity.getRestaurantImages() != null
                                && !restaurantEntity.getRestaurantImages().isEmpty()
                                ? restaurantEntity.getRestaurantImages().get(0).getId().getImage()
                                : null
                            )
                        """)
        RestaurantPublicDetailResponseDTO entityToPublicDetailResponse(RestaurantEntity restaurantEntity);

        RestaurantManagerResponseDTO entityToManagerResponse(RestaurantEntity restaurantEntity);

        RestaurantInfoResponseDTO entityToInfoResponse(RestaurantEntity restaurantEntity);

        RestaurantSubInfoResponseDTO entityToSubInfoResponse(RestaurantEntity restaurantEntity);

        RestaurantCrudResponseDTO entityToCrudResponse(RestaurantEntity restaurantEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "manager", source = "managerId")
        @Mapping(target = "floors", ignore = true)
        @Mapping(target = "categoryTables", ignore = true)
        @Mapping(target = "tables", ignore = true)
        @Mapping(target = "inputTickets", ignore = true)
        @Mapping(target = "suppliers", ignore = true)
        @Mapping(target = "categoryIngredients", ignore = true)
        @Mapping(target = "ingredients", ignore = true)
        @Mapping(target = "categoryFoods", ignore = true)
        @Mapping(target = "foods", ignore = true)
        @Mapping(target = "permissions", ignore = true)
        @Mapping(target = "roles", ignore = true)
        @Mapping(target = "employees", ignore = true)
        @Mapping(target = "restaurantImages", ignore = true)
        RestaurantEntity createEntityFromRequest(RestaurantCreateRequestDTO restaurantCreateRequestDTO);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "manager", source = "managerId")
        @Mapping(target = "status", ignore = true)
        @Mapping(target = "floors", ignore = true)
        @Mapping(target = "categoryTables", ignore = true)
        @Mapping(target = "tables", ignore = true)
        @Mapping(target = "inputTickets", ignore = true)
        @Mapping(target = "suppliers", ignore = true)
        @Mapping(target = "categoryIngredients", ignore = true)
        @Mapping(target = "ingredients", ignore = true)
        @Mapping(target = "categoryFoods", ignore = true)
        @Mapping(target = "foods", ignore = true)
        @Mapping(target = "permissions", ignore = true)
        @Mapping(target = "roles", ignore = true)
        @Mapping(target = "employees", ignore = true)
        @Mapping(target = "restaurantImages", ignore = true)
        void updateEntityFromRequest(
                        RestaurantUpdateRequestDTO restaurantUpdateRequestDTO,
                        @MappingTarget RestaurantEntity restaurantEntity);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "manager", ignore = true)
        @Mapping(target = "name", ignore = true)
        @Mapping(target = "phone", ignore = true)
        @Mapping(target = "email", ignore = true)
        @Mapping(target = "latitude", ignore = true)
        @Mapping(target = "longitude", ignore = true)
        @Mapping(target = "houseNumber", ignore = true)
        @Mapping(target = "streetName", ignore = true)
        @Mapping(target = "ward", ignore = true)
        @Mapping(target = "province", ignore = true)
        @Mapping(target = "description", ignore = true)
        @Mapping(target = "floors", ignore = true)
        @Mapping(target = "categoryTables", ignore = true)
        @Mapping(target = "tables", ignore = true)
        @Mapping(target = "inputTickets", ignore = true)
        @Mapping(target = "suppliers", ignore = true)
        @Mapping(target = "categoryIngredients", ignore = true)
        @Mapping(target = "ingredients", ignore = true)
        @Mapping(target = "categoryFoods", ignore = true)
        @Mapping(target = "foods", ignore = true)
        @Mapping(target = "permissions", ignore = true)
        @Mapping(target = "roles", ignore = true)
        @Mapping(target = "employees", ignore = true)
        @Mapping(target = "restaurantImages", ignore = true)
        void deleteEntityFromRequest(
                        RestaurantDeleteRequestDTO restaurantDeleteRequestDTO,
                        @MappingTarget RestaurantEntity restaurantEntity);
}
