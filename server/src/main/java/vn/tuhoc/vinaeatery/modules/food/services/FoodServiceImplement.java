package vn.tuhoc.vinaeatery.modules.food.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.RecipeEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.FoodMapper;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.RecipeMapper;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.FoodUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.FoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.FoodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.FoodRepository;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.FoodCriteria;
import vn.tuhoc.vinaeatery.modules.food.repositories.specifications.FoodSpecification;
import vn.tuhoc.vinaeatery.modules.food.services.interfaces.FoodService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.services.CloudinaryService;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FoodServiceImplement implements FoodService {
    final EntityManager entityManager;
    final CloudinaryService cloudinaryService;
    final FoodRepository foodRepository;
    final FoodMapper foodMapper;
    final RecipeMapper recipeMapper;

    private FoodEntity getOneById(Integer id) {
        return this.foodRepository.findOneById(id)
                .orElseThrow(() -> new FoodNotFoundByIdException(id));
    }

    private Page<FoodEntity> getAll(FoodCriteria foodCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(foodCriteria.getSort())) {
            String sortString = foodCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(foodCriteria.getPage())
                && ValidationUtil.nonNull(foodCriteria.getSize())) {
            pageable = PageRequest.of(
                    foodCriteria.getPage(),
                    foodCriteria.getSize(),
                    sort);
        }

        Specification<FoodEntity> specification = FoodSpecification.filterFoods(foodCriteria);

        return this.foodRepository.findAll(specification, pageable);
    }

    private List<FoodEntity> getAllCrud() {
        return this.foodRepository.findAllCrud();
    }

    private List<FoodEntity> getAllCrud(Integer restaurantId) {
        return this.foodRepository.findAllCrud(restaurantId);
    }

    @Override
    @Cacheable(value = "food__detail", key = "#id", unless = "#result == null")
    public FoodDetailResponseDTO handleGetDetailById(Integer id) {
        return this.foodMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    @Cacheable(value = "food__summary", key = "#foodCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<FoodSummaryResponseDTO> handleGetSummary(FoodCriteria foodCriteria) {
        Page<FoodSummaryResponseDTO> page = this.getAll(foodCriteria).map(this.foodMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    @Cacheable(value = "food__crud_all", unless = "#result == null")
    public List<FoodCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream().map(this.foodMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "food__crud", key = "#restaurantId", unless = "#result == null")
    public List<FoodCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream()
                .map(this.foodMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "food__detail", key = "#result.id"),
            @CacheEvict(value = "food__summary", allEntries = true),
            @CacheEvict(value = "food__crud_all", allEntries = true),
            @CacheEvict(value = "food__crud", allEntries = true)
    })
    public FoodDetailResponseDTO handleCreate(
            MultipartFile imageFile,
            FoodCreateRequestDTO foodCreateRequestDTO) {
        String image = this.cloudinaryService.getImage(imageFile);

        FoodEntity foodEntity = this.foodMapper
                .createEntityFromRequest(image, foodCreateRequestDTO);

        foodCreateRequestDTO.getRecipes().stream().forEach((recipeCreateRequestDTO) -> {
            RecipeEntity recipeEntity = this.recipeMapper.createEntityFromRequest(recipeCreateRequestDTO);

            foodEntity.addRecipe(recipeEntity);
        });

        return this.foodMapper.entityToDetailResponse(this.foodRepository.save(foodEntity));
    }

    @Override
    @Caching(put = {
            @CachePut(value = "food__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "food__summary", allEntries = true),
            @CacheEvict(value = "food__crud_all", allEntries = true),
            @CacheEvict(value = "food__crud", allEntries = true)
    })
    public FoodDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile imageFile,
            FoodUpdateRequestDTO foodUpdateRequestDTO) {
        String image = this.cloudinaryService.getImage(imageFile);

        FoodEntity foodEntity = this.getOneById(id);
        this.foodMapper.updateEntityFromRequest(image, foodUpdateRequestDTO, foodEntity);

        foodEntity.getRecipes().clear();
        this.entityManager.flush();

        foodUpdateRequestDTO.getRecipes().stream().forEach((recipeUpdateRequestDTO) -> {
            RecipeEntity recipeEntity = this.recipeMapper.updateEntityFromRequest(recipeUpdateRequestDTO);

            foodEntity.addRecipe(recipeEntity);
        });

        return this.foodMapper.entityToDetailResponse(foodEntity);
    }

    @Override
    @Caching(put = {
            @CachePut(value = "food__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "food__summary", allEntries = true),
            @CacheEvict(value = "food__crud_all", allEntries = true),
            @CacheEvict(value = "food__crud", allEntries = true)
    })
    public FoodDetailResponseDTO handleDelete(
            Integer id,
            FoodDeleteRequestDTO foodDeleteRequestDTO) {
        FoodEntity foodEntity = this.getOneById(id);
        this.foodMapper.deleteEntityFromRequest(foodDeleteRequestDTO, foodEntity);

        return this.foodMapper.entityToDetailResponse(foodEntity);
    }
}