package vn.tuhoc.vinaeatery.modules.food.services;

import java.util.List;

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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryFoodEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.CategoryFoodMapper;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryFoodUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryFoodCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.CategoryFoodIsUsingException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.CategoryFoodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.CategoryFoodRepository;
import vn.tuhoc.vinaeatery.modules.food.repositories.FoodRepository;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.CategoryFoodCriteria;
import vn.tuhoc.vinaeatery.modules.food.repositories.specifications.CategoryFoodSpecification;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.services.CloudinaryService;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryFoodService {
    private final CloudinaryService cloudinaryService;
    private final CategoryFoodRepository categoryFoodRepository;
    private final FoodRepository foodRepository;
    private final CategoryFoodMapper categoryFoodMapper;

    private CategoryFoodEntity getOneById(Integer id) {
        return this.categoryFoodRepository.findOneById(id)
                .orElseThrow(() -> new CategoryFoodNotFoundByIdException(id));
    }

    private Page<CategoryFoodEntity> getAll(CategoryFoodCriteria categoryFoodCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(categoryFoodCriteria.getSort())) {
            String sortString = categoryFoodCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(categoryFoodCriteria.getPage())
                && ValidationUtil.nonNull(categoryFoodCriteria.getSize())) {
            pageable = PageRequest.of(
                    categoryFoodCriteria.getPage(),
                    categoryFoodCriteria.getSize(),
                    sort);
        }

        Specification<CategoryFoodEntity> specification = CategoryFoodSpecification
                .filterCategoryFoods(categoryFoodCriteria);

        return this.categoryFoodRepository.findAll(specification, pageable);
    }

    private List<CategoryFoodEntity> getAllCrud() {
        return this.categoryFoodRepository.findAllCrud();
    }

    private List<CategoryFoodEntity> getAllCrud(Integer restaurantId) {
        return this.categoryFoodRepository.findAllCrud(restaurantId);
    }

    @Cacheable(value = "category_food__detail", key = "#id", unless = "#result == null")
    public CategoryFoodDetailResponseDTO handleGetDetailById(Integer id) {
        return this.categoryFoodMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Cacheable(value = "category_food__summary", key = "#categoryFoodCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<CategoryFoodSummaryResponseDTO> handleGetSummary(
            CategoryFoodCriteria categoryFoodCriteria) {
        Page<CategoryFoodSummaryResponseDTO> page = this.getAll(categoryFoodCriteria)
                .map(this.categoryFoodMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Cacheable(value = "category_food__crud_all", unless = "#result == null")
    public List<CategoryFoodCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream().map(this.categoryFoodMapper::entityToCrudResponse).toList();
    }

    @Cacheable(value = "category_food__crud", key = "#restaurantId", unless = "#result == null")
    public List<CategoryFoodCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream().map(this.categoryFoodMapper::entityToCrudResponse).toList();
    }

    @Caching(evict = {
            @CacheEvict(value = "category_food__detail", key = "#result.id"),
            @CacheEvict(value = "category_food__summary", allEntries = true),
            @CacheEvict(value = "category_food__crud_all", allEntries = true),
            @CacheEvict(value = "category_food__crud", allEntries = true)
    })
    public CategoryFoodDetailResponseDTO handleCreate(
            MultipartFile imageFile,
            CategoryFoodCreateRequestDTO categoryFoodCreateRequestDTO) {
        String image = this.cloudinaryService.getImage(imageFile);

        CategoryFoodEntity categoryFoodEntity = this.categoryFoodMapper
                .createEntityFromRequest(image, categoryFoodCreateRequestDTO);

        return this.categoryFoodMapper.entityToDetailResponse(this.categoryFoodRepository.save(categoryFoodEntity));
    }

    @Caching(put = {
            @CachePut(value = "category_food__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "category_food__summary", allEntries = true),
            @CacheEvict(value = "category_food__crud_all", allEntries = true),
            @CacheEvict(value = "category_food__crud", allEntries = true)
    })
    public CategoryFoodDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile imageFile,
            CategoryFoodUpdateRequestDTO categoryFoodUpdateRequestDTO) {
        String image = this.cloudinaryService.getImage(imageFile);

        CategoryFoodEntity categoryFoodEntity = this.getOneById(id);
        this.categoryFoodMapper.updateEntityFromRequest(
                image,
                categoryFoodUpdateRequestDTO,
                categoryFoodEntity);

        return this.categoryFoodMapper.entityToDetailResponse(categoryFoodEntity);
    }

    @Caching(put = {
            @CachePut(value = "category_food__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "category_food__summary", allEntries = true),
            @CacheEvict(value = "category_food__crud_all", allEntries = true),
            @CacheEvict(value = "category_food__crud", allEntries = true)
    })
    public CategoryFoodDetailResponseDTO handleDelete(
            Integer id,
            CategoryFoodDeleteRequestDTO categoryFoodDeleteRequestDTO) {
        CategoryFoodEntity categoryFoodEntity = this.getOneById(id);
        if (this.foodRepository.existsByCategoryFoodIdAndStatusIsActive(id)) {
            throw new CategoryFoodIsUsingException(id);
        }
        this.categoryFoodMapper.deleteEntityFromRequest(
                categoryFoodDeleteRequestDTO,
                categoryFoodEntity);

        return this.categoryFoodMapper.entityToDetailResponse(categoryFoodEntity);
    }
}
