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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.IngredientMapper;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.IngredientUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.IngredientSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.IngredientNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.IngredientRepository;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.IngredientCriteria;
import vn.tuhoc.vinaeatery.modules.food.repositories.specifications.IngredientSpecification;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    private IngredientEntity getOneById(Integer id) {
        return this.ingredientRepository.findOneById(id)
                .orElseThrow(() -> new IngredientNotFoundByIdException(id));
    }

    private Page<IngredientEntity> getAll(IngredientCriteria ingredientCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(ingredientCriteria.getSort())) {
            String sortString = ingredientCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(ingredientCriteria.getPage())
                && ValidationUtil.nonNull(ingredientCriteria.getSize())) {
            pageable = PageRequest.of(
                    ingredientCriteria.getPage(),
                    ingredientCriteria.getSize(),
                    sort);
        }

        Specification<IngredientEntity> specification = IngredientSpecification.filterIngredients(ingredientCriteria);

        return this.ingredientRepository.findAll(specification, pageable);
    }

    private List<IngredientEntity> getAllCrud() {
        return this.ingredientRepository.findAllCrud();
    }

    private List<IngredientEntity> getAllCrud(Integer restaurantId) {
        return this.ingredientRepository.findAllCrud(restaurantId);
    }

    @Cacheable(value = "ingredient__detail", key = "#id", unless = "#result == null")
    public IngredientDetailResponseDTO handleGetDetailById(Integer id) {
        return this.ingredientMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Cacheable(value = "ingredient__summary", key = "#ingredientCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<IngredientSummaryResponseDTO> handleGetSummary(IngredientCriteria ingredientCriteria) {
        Page<IngredientSummaryResponseDTO> page = this.getAll(ingredientCriteria)
                .map(this.ingredientMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Cacheable(value = "ingredient__crud_all", unless = "#result == null")
    public List<IngredientCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream().map(this.ingredientMapper::entityToCrudResponse).toList();
    }

    @Cacheable(value = "ingredient__crud", key = "#restaurantId", unless = "#result == null")
    public List<IngredientCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream().map(this.ingredientMapper::entityToCrudResponse).toList();
    }

    @Caching(evict = {
            @CacheEvict(value = "ingredient__detail", key = "#result.id"),
            @CacheEvict(value = "ingredient__summary", allEntries = true),
            @CacheEvict(value = "ingredient__crud_all", allEntries = true),
            @CacheEvict(value = "ingredient__crud", allEntries = true)
    })
    public IngredientDetailResponseDTO handleCreate(IngredientCreateRequestDTO ingredientCreateRequestDTO) {
        IngredientEntity ingredientEntity = this.ingredientMapper.createEntityFromRequest(ingredientCreateRequestDTO);

        return this.ingredientMapper.entityToDetailResponse(this.ingredientRepository.save(ingredientEntity));
    }

    @Caching(put = {
            @CachePut(value = "ingredient__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "ingredient__summary", allEntries = true),
            @CacheEvict(value = "ingredient__crud_all", allEntries = true),
            @CacheEvict(value = "ingredient__crud", allEntries = true)
    })
    public IngredientDetailResponseDTO handleUpdate(Integer id, IngredientUpdateRequestDTO ingredientUpdateRequestDTO) {
        IngredientEntity ingredientEntity = this.getOneById(id);
        this.ingredientMapper.updateEntityFromRequest(ingredientUpdateRequestDTO, ingredientEntity);

        return this.ingredientMapper.entityToDetailResponse(ingredientEntity);
    }

    @Caching(put = {
            @CachePut(value = "ingredient__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "ingredient__summary", allEntries = true),
            @CacheEvict(value = "ingredient__crud_all", allEntries = true),
            @CacheEvict(value = "ingredient__crud", allEntries = true)
    })
    public IngredientDetailResponseDTO handleDelete(Integer id, IngredientDeleteRequestDTO IngredientDeleteRequestDTO) {
        IngredientEntity ingredientEntity = this.getOneById(id);
        this.ingredientMapper.deleteEntityFromRequest(IngredientDeleteRequestDTO, ingredientEntity);

        return this.ingredientMapper.entityToDetailResponse(ingredientEntity);
    }
}