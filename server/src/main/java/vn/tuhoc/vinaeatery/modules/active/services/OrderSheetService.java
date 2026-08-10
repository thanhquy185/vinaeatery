package vn.tuhoc.vinaeatery.modules.active.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.OrderSheetDetailMapper;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.OrderSheetMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.OrderSheetCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.OrderSheetUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.OrderSheetIngredientInsufficientInventory;
import vn.tuhoc.vinaeatery.modules.active.exceptions.OrderSheetNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.repositories.OrderSheetRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.OrderSheetCriteria;
import vn.tuhoc.vinaeatery.modules.active.repositories.specifications.OrderSheetSpecification;
import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.EmployeeMapperHelper;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.RecipeEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.RecipeMapper2;
import vn.tuhoc.vinaeatery.modules.food.repositories.RecipeRepository;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderSheetService {
    private final OrderSheetRepository orderSheetRepository;
    private final RecipeRepository recipeRepository;
    private final OrderSheetMapper orderSheetMapper;
    private final OrderSheetDetailMapper orderSheetDetailMapper;
    private final RecipeMapper2 recipeMapper2;
    private final EmployeeMapperHelper employeeMapperHelper;

    private OrderSheetEntity getOneById(Integer id) {
        return this.orderSheetRepository.findOneById(id)
                .orElseThrow(() -> new OrderSheetNotFoundByIdException(id));
    }

    private Page<OrderSheetEntity> getAll(OrderSheetCriteria orderSheetCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(orderSheetCriteria.getSort())) {
            String sortString = orderSheetCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "create_at__asc" -> sort = Sort.by("createAt").ascending();
                case "create_at__desc" -> sort = Sort.by("createAt").descending();
                case "service_at__asc" -> sort = Sort.by("serviceAt").ascending();
                case "service_at__desc" -> sort = Sort.by("serviceAt").descending();
                case "cancel_at__asc" -> sort = Sort.by("cancelAt").ascending();
                case "cancel_at__desc" -> sort = Sort.by("cancelAt").descending();
                case "total_price__asc" -> sort = Sort.by("totalPrice").ascending();
                case "total_price__desc" -> sort = Sort.by("totalPrice").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(orderSheetCriteria.getPage())
                && ValidationUtil.nonNull(orderSheetCriteria.getSize())) {
            pageable = PageRequest.of(
                    orderSheetCriteria.getPage(),
                    orderSheetCriteria.getSize(),
                    sort);
        }

        Specification<OrderSheetEntity> specification = OrderSheetSpecification.filterOrderSheets(orderSheetCriteria);

        return this.orderSheetRepository.findAll(specification, pageable);
    }

    public OrderSheetDetailResponseDTO handleGetDetailById(Integer id) {
        OrderSheetDetailResponseDTO orderSheetDetailResponseDTO = this.orderSheetMapper
                .entityToDetailResponse(this.getOneById(id));

        // Truy vấn dữ liệu Công thức món ăn
        List<Integer> foodIds = orderSheetDetailResponseDTO.getOrderSheetDetails()
                .stream()
                .map((orderSheetDetail) -> orderSheetDetail.getFood().getId())
                .toList();
        List<RecipeEntity> recipeEntities = this.recipeRepository.findAllByFoodIds(foodIds);
        orderSheetDetailResponseDTO.getOrderSheetDetails()
                .stream()
                .forEach((orderSheetDetail) -> {
                    List<RecipeEntity> foodRecipeEntities = recipeEntities
                            .stream()
                            .filter(
                                    (recipeEntity) -> recipeEntity.getFood().getId()
                                            .equals(orderSheetDetail.getFood().getId()))
                            .toList();
                    orderSheetDetail.getFood()
                            .setRecipes(
                                    foodRecipeEntities
                                            .stream()
                                            .map(this.recipeMapper2::entityToDetailResponse)
                                            .toList());
                });

        return orderSheetDetailResponseDTO;
    }

    public PageResponseDTO<OrderSheetSummaryResponseDTO> handleGetSummary(OrderSheetCriteria orderSheetCriteria) {
        Page<OrderSheetSummaryResponseDTO> page = this.getAll(orderSheetCriteria)
                .map(this.orderSheetMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    public OrderSheetDetailResponseDTO handleCreate(OrderSheetCreateRequestDTO orderSheetCreateRequestDTO) {
        OrderSheetEntity orderSheetEntity = this.orderSheetMapper.createEntityFromRequest(orderSheetCreateRequestDTO);

        orderSheetCreateRequestDTO.getOrderSheetDetails().forEach((orderSheetDetailCreateRequestDTO) -> {
            OrderSheetDetailEntity orderSheetDetailEntity = this.orderSheetDetailMapper
                    .createEntityFromRequest(orderSheetDetailCreateRequestDTO);

            orderSheetEntity.addOrderSheetDetail(orderSheetDetailEntity);
        });

        return this.orderSheetMapper.entityToDetailResponse(this.orderSheetRepository.save(orderSheetEntity));
    }

    public OrderSheetDetailResponseDTO handleUpdateStatus(
            Integer id,
            OrderSheetUpdateStatusRequestDTO orderSheetUpdateStatusRequestDTO) {
        OrderSheetEntity orderSheetEntity = this.getOneById(id);
        this.orderSheetMapper.updateStatusEntityFromRequest(
                orderSheetUpdateStatusRequestDTO,
                orderSheetEntity);

        if (ValidationUtil.nonNull(orderSheetUpdateStatusRequestDTO.getEmployeeId())) {
            orderSheetEntity
                    .setEmployee(
                            this.employeeMapperHelper.mapToEntity(orderSheetUpdateStatusRequestDTO.getEmployeeId()));
        }
        if (orderSheetEntity.getStatus().equals(OrderSheetStatusEnum.CONFIRMED)
                && ValidationUtil.nonNull(orderSheetEntity.getOrderSheetDetails())) {
            // Tính tổng nguyên liệu cần
            Map<IngredientEntity, Long> requiredIngredients = new HashMap<>();
            for (OrderSheetDetailEntity detail : orderSheetEntity.getOrderSheetDetails()) {
                for (RecipeEntity recipe : detail.getFood().getRecipes()) {
                    Long requiredQuantity = recipe.getQuantity() * detail.getQuantity();

                    requiredIngredients.merge(
                            recipe.getIngredient(),
                            requiredQuantity,
                            Long::sum);
                }
            }
            // Kiểm tra tồn kho
            StringBuilder message = new StringBuilder();
            for (Map.Entry<IngredientEntity, Long> entry : requiredIngredients.entrySet()) {
                IngredientEntity ingredient = entry.getKey();
                long required = entry.getValue();

                if (ingredient.getInventory() < required) {
                    if (!message.isEmpty()) {
                        message.append(" | ");
                    }

                    message.append(String.format(
                            "%s chỉ còn %d nhưng cần %d",
                            ingredient.getName(),
                            ingredient.getInventory(),
                            required));
                }
            }
            if (!message.isEmpty()) {
                throw new OrderSheetIngredientInsufficientInventory(message.toString());
            }

            orderSheetEntity.getOrderSheetDetails().stream().forEach(((orderSheetDetailEntity) -> {
                orderSheetDetailEntity.getFood().getRecipes().stream().forEach((recipe) -> {
                    IngredientEntity ingredientEntity = recipe.getIngredient();
                    ingredientEntity
                            .setInventory(ingredientEntity.getInventory()
                                    - recipe.getQuantity() * orderSheetDetailEntity.getQuantity());
                });
            }));
        }

        return this.orderSheetMapper.entityToDetailResponse(orderSheetEntity);
    }
}