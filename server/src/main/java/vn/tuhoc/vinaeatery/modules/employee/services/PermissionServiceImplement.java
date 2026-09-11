package vn.tuhoc.vinaeatery.modules.employee.services;

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

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionDetailEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.PermissionDetailMapper;
import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.PermissionMapper;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.PermissionUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.PermissionCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.PermissionIsUsingException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.PermissionNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.repositories.EmployeeRepository;
import vn.tuhoc.vinaeatery.modules.employee.repositories.PermissionRepository;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.PermissionCriteria;
import vn.tuhoc.vinaeatery.modules.employee.repositories.specifications.PermissionSpecification;
import vn.tuhoc.vinaeatery.modules.employee.services.interfaces.PermissionService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionServiceImplement implements PermissionService {
    final EntityManager entityManager;
    final EmployeeRepository employeeRepository;
    final PermissionRepository permissionRepository;
    final PermissionMapper permissionMapper;
    final PermissionDetailMapper permissionDetailMapper;

    private PermissionEntity getOneById(Integer id) {
        return this.permissionRepository.findOneById(id)
                .orElseThrow(() -> new PermissionNotFoundByIdException(id));
    }

    private Page<PermissionEntity> getAll(PermissionCriteria permissionCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(permissionCriteria.getSort())) {
            String sortString = permissionCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(permissionCriteria.getPage())
                && ValidationUtil.nonNull(permissionCriteria.getSize())) {
            pageable = PageRequest.of(
                    permissionCriteria.getPage(),
                    permissionCriteria.getSize(),
                    sort);
        }

        Specification<PermissionEntity> specification = PermissionSpecification.filterPermissions(permissionCriteria);

        return this.permissionRepository.findAll(specification, pageable);
    }

    private List<PermissionEntity> getAllCrud() {
        return this.permissionRepository.findAllCrud();
    }

    private List<PermissionEntity> getAllCrud(Integer restaurantId) {
        return this.permissionRepository.findAllCrud(restaurantId);
    }

    @Override
    @Cacheable(value = "permission__detail", key = "#id", unless = "#result == null")
    public PermissionDetailResponseDTO handleGetDetailById(Integer id) {
        return this.permissionMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    @Cacheable(value = "permission__summary", key = "#permissionCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<PermissionSummaryResponseDTO> handleGetSummary(PermissionCriteria permissionCriteria) {
        Page<PermissionSummaryResponseDTO> page = this.getAll(permissionCriteria)
                .map(this.permissionMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    @Cacheable(value = "permission__crud_all", unless = "#result == null")
    public List<PermissionCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.permissionMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "permission__crud", key = "#restaurantId", unless = "#result == null")
    public List<PermissionCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream()
                .map(this.permissionMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "permission__detail", key = "#result.id"),
            @CacheEvict(value = "permission__summary", allEntries = true),
            @CacheEvict(value = "permission__crud_all", allEntries = true),
            @CacheEvict(value = "permission__crud", allEntries = true)
    })
    public PermissionDetailResponseDTO handleCreate(PermissionCreateRequestDTO permissionCreateRequestDTO) {
        PermissionEntity permissionEntity = this.permissionMapper.createEntityFromRequest(permissionCreateRequestDTO);

        permissionCreateRequestDTO.getPermissionDetails().forEach((permissionDetailCreateRequestDTO) -> {
            PermissionDetailEntity permissionDetailEntity = this.permissionDetailMapper
                    .createEntityFromRequest(permissionDetailCreateRequestDTO);

            permissionEntity.addPermissionDetail(permissionDetailEntity);
        });

        return this.permissionMapper.entityToDetailResponse(permissionRepository.save(permissionEntity));
    }

    @Override
    @Caching(put = {
            @CachePut(value = "permission__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "permission__summary", allEntries = true),
            @CacheEvict(value = "permission__crud_all", allEntries = true),
            @CacheEvict(value = "permission__crud", allEntries = true)
    })
    public PermissionDetailResponseDTO handleUpdate(
            Integer id,
            PermissionUpdateRequestDTO permissionUpdateRequestDTO) {
        PermissionEntity permissionEntity = this.getOneById(id);
        this.permissionMapper.updateEntityFromRequest(permissionUpdateRequestDTO, permissionEntity);

        permissionEntity.getPermissionDetails().clear();
        this.entityManager.flush();

        permissionUpdateRequestDTO.getPermissionDetails().forEach((permissionDetailUpdateRequestDTO) -> {
            PermissionDetailEntity permissionDetailEntity = this.permissionDetailMapper
                    .createEntityFromRequest(permissionDetailUpdateRequestDTO);

            permissionEntity.addPermissionDetail(permissionDetailEntity);
        });

        return this.permissionMapper.entityToDetailResponse(permissionEntity);
    }

    @Override
    @Caching(put = {
            @CachePut(value = "permission__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "permission__summary", allEntries = true),
            @CacheEvict(value = "permission__crud_all", allEntries = true),
            @CacheEvict(value = "permission__crud", allEntries = true)
    })
    public PermissionDetailResponseDTO handleDelete(
            Integer id,
            PermissionDeleteRequestDTO permissionDeleteRequestDTO) {
        PermissionEntity permissionEntity = this.getOneById(id);
        if (this.employeeRepository.existsByPermissionIdAndStatusActive(id)) {
            throw new PermissionIsUsingException(id);
        }
        this.permissionMapper.deleteEntityFromRequest(permissionDeleteRequestDTO, permissionEntity);

        return this.permissionMapper.entityToDetailResponse(permissionEntity);
    }
}