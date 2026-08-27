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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryIngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.CategoryIngredientMapper;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.CategoryIngredientUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.CategoryIngredientCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.CategoryIngredientIsUsingException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.CategoryIngredientNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.CategoryIngredientRepository;
import vn.tuhoc.vinaeatery.modules.food.repositories.IngredientRepository;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.CategoryIngredientCriteria;
import vn.tuhoc.vinaeatery.modules.food.repositories.specifications.CategoryIngredientSpecification;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryIngredientService {
    private final CategoryIngredientRepository categoryIngredientRepository;
    private final IngredientRepository ingredientRepository;
    private final CategoryIngredientMapper categoryIngredientMapper;

    private CategoryIngredientEntity getOneById(Integer id) {
        return this.categoryIngredientRepository.findOneById(id)
                .orElseThrow(() -> new CategoryIngredientNotFoundByIdException(id));
    }

    private Page<CategoryIngredientEntity> getAll(CategoryIngredientCriteria categoryIngredientCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(categoryIngredientCriteria.getSort())) {
            String sortString = categoryIngredientCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(categoryIngredientCriteria.getPage())
                && ValidationUtil.nonNull(categoryIngredientCriteria.getSize())) {
            pageable = PageRequest.of(
                    categoryIngredientCriteria.getPage(),
                    categoryIngredientCriteria.getSize(),
                    sort);
        }

        Specification<CategoryIngredientEntity> specification = CategoryIngredientSpecification
                .filterCategoryIngredients(categoryIngredientCriteria);

        return this.categoryIngredientRepository.findAll(specification, pageable);
    }

    private List<CategoryIngredientEntity> getAllCrud() {
        return this.categoryIngredientRepository.findAllCrud();
    }

    private List<CategoryIngredientEntity> getAllCrud(Integer restaurantId) {
        return this.categoryIngredientRepository.findAllCrud(restaurantId);
    }

    @Cacheable(value = "category_ingredient__detail", key = "#id", unless = "#result == null")
    public CategoryIngredientDetailResponseDTO handleGetDetailById(Integer id) {
        return this.categoryIngredientMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Cacheable(value = "category_ingredient__summary", key = "#categoryIngredientCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<CategoryIngredientSummaryResponseDTO> handleGetSummary(
            CategoryIngredientCriteria categoryIngredientCriteria) {
        Page<CategoryIngredientSummaryResponseDTO> page = this.getAll(categoryIngredientCriteria)
                .map(this.categoryIngredientMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Cacheable(value = "category_ingredient__crud_all", unless = "#result == null")
    public List<CategoryIngredientCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.categoryIngredientMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "category_ingredient__crud", key = "#restaurantId", unless = "#result == null")
    public List<CategoryIngredientCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream()
                .map(this.categoryIngredientMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Caching(evict = {
            @CacheEvict(value = "category_ingredient__detail", key = "#result.id"),
            @CacheEvict(value = "category_ingredient__summary", allEntries = true),
            @CacheEvict(value = "category_ingredient__crud_all", allEntries = true),
            @CacheEvict(value = "category_ingredient__crud", allEntries = true)
    })
    public CategoryIngredientDetailResponseDTO handleCreate(
            CategoryIngredientCreateRequestDTO categoryIngredientCreateRequestDTO) {
        CategoryIngredientEntity categoryIngredientEntity = this.categoryIngredientMapper
                .createEntityFromRequest(categoryIngredientCreateRequestDTO);

        return this.categoryIngredientMapper
                .entityToDetailResponse(this.categoryIngredientRepository.save(categoryIngredientEntity));
    }

    @Caching(put = {
            @CachePut(value = "category_ingredient__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "category_ingredient__summary", allEntries = true),
            @CacheEvict(value = "category_ingredient__crud_all", allEntries = true),
            @CacheEvict(value = "category_ingredient__crud", allEntries = true)
    })
    public CategoryIngredientDetailResponseDTO handleUpdate(Integer id,
            CategoryIngredientUpdateRequestDTO categoryIngredientUpdateRequestDTO) {
        CategoryIngredientEntity categoryIngredientEntity = this.getOneById(id);
        this.categoryIngredientMapper.updateEntityFromRequest(categoryIngredientUpdateRequestDTO,
                categoryIngredientEntity);

        return this.categoryIngredientMapper.entityToDetailResponse(categoryIngredientEntity);
    }

    @Caching(put = {
            @CachePut(value = "category_ingredient__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "category_ingredient__summary", allEntries = true),
            @CacheEvict(value = "category_ingredient__crud_all", allEntries = true),
            @CacheEvict(value = "category_ingredient__crud", allEntries = true)
    })
    public CategoryIngredientDetailResponseDTO handleDelete(Integer id,
            CategoryIngredientDeleteRequestDTO categoryIngredientDeleteRequestDTO) {
        CategoryIngredientEntity categoryIngredientEntity = this.getOneById(id);
        if (this.ingredientRepository.existsByCategoryIngredientIdAndStatusIsActive(id)) {
            throw new CategoryIngredientIsUsingException(id);
        }
        this.categoryIngredientMapper.deleteEntityFromRequest(categoryIngredientDeleteRequestDTO,
                categoryIngredientEntity);

        return this.categoryIngredientMapper.entityToDetailResponse(categoryIngredientEntity);
    }
}
