package vn.tuhoc.vinaeatery.modules.table.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.FloorEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.mappers.FloorMapper;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.FloorUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.FloorCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.exceptions.FloorIsUsingException;
import vn.tuhoc.vinaeatery.modules.table.exceptions.FloorNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.table.repositories.FloorRepository;
import vn.tuhoc.vinaeatery.modules.table.repositories.TableRepository;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.FloorCriteria;
import vn.tuhoc.vinaeatery.modules.table.repositories.specifications.FloorSpecification;
import vn.tuhoc.vinaeatery.modules.table.services.interfaces.FloorService;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FloorServiceImplement implements FloorService {
    TableRepository tableRepository;
    FloorRepository floorRepository;
    FloorMapper floorMapper;

    private FloorEntity getOneById(Integer id) {
        return this.floorRepository.findOneById(id)
                .orElseThrow(() -> new FloorNotFoundByIdException(id));
    }

    private Page<FloorEntity> getAll(FloorCriteria floorCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(floorCriteria.getSort())) {
            String sortString = floorCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(floorCriteria.getPage())
                && ValidationUtil.nonNull(floorCriteria.getSize())) {
            pageable = PageRequest.of(
                    floorCriteria.getPage(),
                    floorCriteria.getSize(),
                    sort);
        }

        Specification<FloorEntity> combinedSpec = FloorSpecification.filterFloors(floorCriteria);

        return this.floorRepository.findAll(combinedSpec, pageable);
    }

    private List<FloorEntity> getAllCrud() {
        return this.floorRepository.findAllCrud();
    }

    private List<FloorEntity> getAllCrud(Integer restaurantId) {
        return this.floorRepository.findAllCrud(restaurantId);
    }

    @Override
    @Cacheable(value = "floor__detail", key = "#id", unless = "#result == null")
    public FloorDetailResponseDTO handleGetDetailById(Integer id) {
        return this.floorMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    @Cacheable(value = "floor__summary", key = "#floorCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<FloorSummaryResponseDTO> handleGetSummary(FloorCriteria floorCriteria) {
        Page<FloorSummaryResponseDTO> page = this.getAll(floorCriteria)
                .map(this.floorMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    @Cacheable(value = "floor__crud_all", unless = "#result == null")
    public List<FloorCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.floorMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "floor__crud", key = "#restaurantId", unless = "#result == null")
    public List<FloorCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream()
                .map(this.floorMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "floor__detail", key = "#result.id"),
            @CacheEvict(value = "floor__summary", allEntries = true),
            @CacheEvict(value = "floor__crud_all", allEntries = true),
            @CacheEvict(value = "floor__crud", allEntries = true)
    })
    public FloorDetailResponseDTO handleCreate(FloorCreateRequestDTO floorCreateRequestDTO) {
        FloorEntity floorEntity = this.floorMapper.createEntityFromRequest(floorCreateRequestDTO);

        return this.floorMapper.entityToDetailResponse(this.floorRepository.save(floorEntity));
    }

    @Override
    @Caching(put = {
            @CachePut(value = "floor__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "floor__summary", allEntries = true),
            @CacheEvict(value = "floor__crud_all", allEntries = true),
            @CacheEvict(value = "floor__crud", allEntries = true)
    })
    public FloorDetailResponseDTO handleUpdate(Integer id, FloorUpdateRequestDTO floorUpdateRequestDTO) {
        FloorEntity floorEntity = this.getOneById(id);
        this.floorMapper.updateEntityFromRequest(floorUpdateRequestDTO, floorEntity);

        return this.floorMapper.entityToDetailResponse(floorEntity);
    }

    @Override
    @Caching(put = {
            @CachePut(value = "floor__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "floor__summary", allEntries = true),
            @CacheEvict(value = "floor__crud_all", allEntries = true),
            @CacheEvict(value = "floor__crud", allEntries = true)
    })
    public FloorDetailResponseDTO handleDelete(Integer id, FloorDeleteRequestDTO floorDeleteRequestDTO) {
        FloorEntity floorEntity = this.getOneById(id);
        if (this.tableRepository.existsByFloorIdAndStatusIsActive(id)) {
            throw new FloorIsUsingException(id);
        }
        this.floorMapper.deleteEntityFromRequest(floorDeleteRequestDTO, floorEntity);

        return this.floorMapper.entityToDetailResponse(floorEntity);
    }
}
