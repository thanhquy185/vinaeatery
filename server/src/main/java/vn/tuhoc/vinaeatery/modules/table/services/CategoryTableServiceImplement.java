package vn.tuhoc.vinaeatery.modules.table.services;

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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.CategoryTableEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.mappers.CategoryTableMapper;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.exceptions.CategoryTableIsUsingException;
import vn.tuhoc.vinaeatery.modules.table.exceptions.CategoryTableNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.table.repositories.CategoryTableRepository;
import vn.tuhoc.vinaeatery.modules.table.repositories.TableRepository;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.CategoryTableCriteria;
import vn.tuhoc.vinaeatery.modules.table.repositories.specifications.CategoryTableSpecification;
import vn.tuhoc.vinaeatery.modules.table.services.interfaces.CategoryTableService;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryTableServiceImplement implements CategoryTableService {
    TableRepository tableRepository;
    CategoryTableRepository categoryTableRepository;
    CategoryTableMapper categoryTableMapper;

    private CategoryTableEntity getOneById(Integer id) {
        return this.categoryTableRepository.findOneById(id)
                .orElseThrow(() -> new CategoryTableNotFoundByIdException(id));
    }

    private Page<CategoryTableEntity> getAll(CategoryTableCriteria categoryTableCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(categoryTableCriteria.getSort())) {
            String sortString = categoryTableCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(categoryTableCriteria.getPage())
                && ValidationUtil.nonNull(categoryTableCriteria.getSize())) {
            pageable = PageRequest.of(
                    categoryTableCriteria.getPage(),
                    categoryTableCriteria.getSize(),
                    sort);
        }

        Specification<CategoryTableEntity> specification = CategoryTableSpecification
                .filterCategoryTables(categoryTableCriteria);

        return this.categoryTableRepository.findAll(specification, pageable);
    }

    private List<CategoryTableEntity> getAllCrud() {
        return this.categoryTableRepository.findAllCrud();
    }

    private List<CategoryTableEntity> getAllCrud(Integer restaurantId) {
        return this.categoryTableRepository.findAllCrud(restaurantId);
    }

    @Override
    @Cacheable(value = "category_table__detail", key = "#id", unless = "#result == null")
    public CategoryTableDetailResponseDTO handleGetDetailById(Integer id) {
        return this.categoryTableMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    @Cacheable(value = "category_table__summary", key = "#categoryTableCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<CategoryTableSummaryResponseDTO> handleGetSummary(
            CategoryTableCriteria categoryTableCriteria) {
        Page<CategoryTableSummaryResponseDTO> page = this.getAll(categoryTableCriteria)
                .map(this.categoryTableMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    @Cacheable(value = "category_table__crud_all", unless = "#result == null")
    public List<CategoryTableCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.categoryTableMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "category_table__crud", unless = "#result == null")
    public List<CategoryTableCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream()
                .map(this.categoryTableMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "category_table__detail", key = "#result.id"),
            @CacheEvict(value = "category_table__summary", allEntries = true),
            @CacheEvict(value = "category_table__crud_all", allEntries = true),
            @CacheEvict(value = "category_table__crud", allEntries = true)
    })
    public CategoryTableDetailResponseDTO handleCreate(CategoryTableCreateRequestDTO categoryTableCreateRequestDTO) {
        CategoryTableEntity categoryTableEntity = this.categoryTableMapper
                .createEntityFromRequest(categoryTableCreateRequestDTO);

        return this.categoryTableMapper.entityToDetailResponse(this.categoryTableRepository.save(categoryTableEntity));
    }

    @Override
    @Caching(put = {
            @CachePut(value = "category_table__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "category_table__summary", allEntries = true),
            @CacheEvict(value = "category_table__crud_all", allEntries = true),
            @CacheEvict(value = "category_table__crud", allEntries = true)
    })
    public CategoryTableDetailResponseDTO handleUpdate(
            Integer id,
            CategoryTableUpdateRequestDTO categoryTableUpdateRequestDTO) {
        CategoryTableEntity categoryTableEntity = this.getOneById(id);
        this.categoryTableMapper.updateEntityFromRequest(categoryTableUpdateRequestDTO, categoryTableEntity);

        return this.categoryTableMapper.entityToDetailResponse(categoryTableEntity);
    }

    @Override
    @Caching(put = {
            @CachePut(value = "category_table__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "category_table__summary", allEntries = true),
            @CacheEvict(value = "category_table__crud_all", allEntries = true),
            @CacheEvict(value = "category_table__crud", allEntries = true)
    })
    public CategoryTableDetailResponseDTO handleDelete(
            Integer id,
            CategoryTableDeleteRequestDTO categoryTableDeleteRequestDTO) {
        CategoryTableEntity categoryTableEntity = this.getOneById(id);
        if (this.tableRepository.existsByCategoryTableIdAndStatusIsActive(id)) {
            throw new CategoryTableIsUsingException(id);
        }
        this.categoryTableMapper.deleteEntityFromRequest(categoryTableDeleteRequestDTO, categoryTableEntity);

        return this.categoryTableMapper.entityToDetailResponse(categoryTableEntity);
    }
}
