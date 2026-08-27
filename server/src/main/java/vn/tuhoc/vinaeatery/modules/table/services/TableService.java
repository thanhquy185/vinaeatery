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
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.mappers.TableMapper;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.TableUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.exceptions.TableNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.table.repositories.TableRepository;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.TableCriteria;
import vn.tuhoc.vinaeatery.modules.table.repositories.specifications.TableSpecification;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class TableService {
    private final TableRepository tableRepository;
    private final TableMapper tableMapper;

    private TableEntity getOneById(Integer id) {
        return this.tableRepository.findOneById(id)
                .orElseThrow(() -> new TableNotFoundByIdException(id));
    }

    private Page<TableEntity> getAll(TableCriteria tableCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(tableCriteria.getSort())) {
            String sortString = tableCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(tableCriteria.getPage())
                && ValidationUtil.nonNull(tableCriteria.getSize())) {
            pageable = PageRequest.of(
                    tableCriteria.getPage(),
                    tableCriteria.getSize(),
                    sort);
        }

        Specification<TableEntity> specification = TableSpecification.filterTables(tableCriteria);

        return this.tableRepository.findAll(specification, pageable);
    }

    private List<TableEntity> getAllCrud() {
        return this.tableRepository.findAllCrud();
    }

    private List<TableEntity> getAllCrud(Integer restaurantId) {
        return this.tableRepository.findAllCrud(restaurantId);
    }

    @Cacheable(value = "table__detail", key = "#id", unless = "#result == null")
    public TableDetailResponseDTO handleGetDetailById(Integer id) {
        return this.tableMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Cacheable(value = "table__summary", key = "#tableCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<TableSummaryResponseDTO> handleGetSummary(TableCriteria tableCriteria) {
        Page<TableSummaryResponseDTO> page = this.getAll(tableCriteria).map(this.tableMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Cacheable(value = "table__crud_all", unless = "#result == null")
    public List<TableCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.tableMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "table__crud", key = "#restaurantId", unless = "#result == null")
    public List<TableCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream()
                .map(this.tableMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Caching(evict = {
            @CacheEvict(value = "table__detail", key = "#result.id"),
            @CacheEvict(value = "table__summary", allEntries = true),
            @CacheEvict(value = "table__crud_all", allEntries = true),
            @CacheEvict(value = "table__crud", allEntries = true)
    })
    public TableDetailResponseDTO handleCreate(TableCreateRequestDTO tableCreateRequestDTO) {
        TableEntity tableEntity = this.tableMapper.createEntityFromRequest(tableCreateRequestDTO);

        return this.tableMapper.entityToDetailResponse(this.tableRepository.save(tableEntity));
    }

    @Caching(put = {
            @CachePut(value = "table__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "table__summary", allEntries = true),
            @CacheEvict(value = "table__crud_all", allEntries = true),
            @CacheEvict(value = "table__crud", allEntries = true)
    })
    public TableDetailResponseDTO handleUpdate(Integer id, TableUpdateRequestDTO tableUpdateRequestDTO) {
        TableEntity tableEntity = this.getOneById(id);
        this.tableMapper.updateEntityFromRequest(tableUpdateRequestDTO, tableEntity);

        return this.tableMapper.entityToDetailResponse(tableEntity);
    }

    @Caching(put = {
            @CachePut(value = "table__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "table__summary", allEntries = true),
            @CacheEvict(value = "table__crud_all", allEntries = true),
            @CacheEvict(value = "table__crud", allEntries = true)
    })
    public TableDetailResponseDTO handleDelete(Integer id, TableDeleteRequestDTO tableDeleteRequestDTO) {
        TableEntity tableEntity = this.getOneById(id);
        this.tableMapper.deleteEntityFromRequest(tableDeleteRequestDTO, tableEntity);

        return this.tableMapper.entityToDetailResponse(tableEntity);
    }
}