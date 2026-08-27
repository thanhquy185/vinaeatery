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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.RoleMapper;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.RoleCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.RoleIsUsingException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.RoleNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.repositories.RoleHistoryRepository;
import vn.tuhoc.vinaeatery.modules.employee.repositories.RoleRepository;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.RoleCriteria;
import vn.tuhoc.vinaeatery.modules.employee.repositories.specifications.RoleSpecification;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {
    private final RoleHistoryRepository roleHistoryRepository;
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    private RoleEntity getOneById(Integer id) {
        return this.roleRepository.findOneById(id)
                .orElseThrow(() -> new RoleNotFoundByIdException(id));
    }

    private Page<RoleEntity> getAll(RoleCriteria roleCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(roleCriteria.getSort())) {
            String sortString = roleCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(roleCriteria.getPage())
                && ValidationUtil.nonNull(roleCriteria.getSize())) {
            pageable = PageRequest.of(
                    roleCriteria.getPage(),
                    roleCriteria.getSize(),
                    sort);
        }

        Specification<RoleEntity> specification = RoleSpecification.filterRoles(roleCriteria);

        return this.roleRepository.findAll(specification, pageable);
    }

    private List<RoleEntity> getAllCrud() {
        return this.roleRepository.findAllCrud();
    }

    private List<RoleEntity> getAllCrud(Integer restaurantId) {
        return this.roleRepository.findAllCrud(restaurantId);
    }

    @Cacheable(value = "role__detail", key = "#id", unless = "#result == null")
    public RoleDetailResponseDTO handleGetDetailById(Integer id) {
        return this.roleMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Cacheable(value = "role__summary", key = "#roleCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<RoleSummaryResponseDTO> handleGetSummary(RoleCriteria roleCriteria) {
        Page<RoleSummaryResponseDTO> page = this.getAll(roleCriteria).map(this.roleMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Cacheable(value = "role__crud_all", unless = "#result == null")
    public List<RoleCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.roleMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "role__crud", key = "#restaurantId", unless = "#result == null")
    public List<RoleCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream()
                .map(this.roleMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Caching(evict = {
            @CacheEvict(value = "role__detail", key = "#result.id"),
            @CacheEvict(value = "role__summary", allEntries = true),
            @CacheEvict(value = "role__crud_all", allEntries = true),
            @CacheEvict(value = "role__crud", allEntries = true)
    })
    public RoleDetailResponseDTO handleCreate(RoleCreateRequestDTO roleCreateRequestDTO) {
        RoleEntity roleEntity = this.roleMapper.createEntityFromRequest(roleCreateRequestDTO);

        return this.roleMapper.entityToDetailResponse(this.roleRepository.save(roleEntity));
    }

    @Caching(put = {
            @CachePut(value = "role__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "role__summary", allEntries = true),
            @CacheEvict(value = "role__crud_all", allEntries = true),
            @CacheEvict(value = "role__crud", allEntries = true)
    })
    public RoleDetailResponseDTO handleUpdate(Integer id, RoleUpdateRequestDTO roleUpdateRequestDTO) {
        RoleEntity roleEntity = this.getOneById(id);
        this.roleMapper.updateEntityFromRequest(roleUpdateRequestDTO, roleEntity);

        return this.roleMapper.entityToDetailResponse(roleEntity);
    }

    @Caching(put = {
            @CachePut(value = "role__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "role__summary", allEntries = true),
            @CacheEvict(value = "role__crud_all", allEntries = true),
            @CacheEvict(value = "role__crud", allEntries = true)
    })
    public RoleDetailResponseDTO handleDelete(Integer id, RoleDeleteRequestDTO roleDeleteRequestDTO) {
        RoleEntity roleEntity = this.getOneById(id);
        if (this.roleHistoryRepository.existsByRoleIdAndDateEndIsNull(id)) {
            throw new RoleIsUsingException(id);
        }
        this.roleMapper.deleteEntityFromRequest(roleDeleteRequestDTO, roleEntity);

        return this.roleMapper.entityToDetailResponse(roleEntity);
    }
}