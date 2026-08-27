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
import vn.tuhoc.vinaeatery.modules.food.domains.entities.SupplierEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.SupplierMapper;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.SupplierUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.SupplierSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.SupplierEmailIsExistsException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.SupplierNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.SupplierPhoneIsExistsException;
import vn.tuhoc.vinaeatery.modules.food.repositories.SupplierRepository;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.SupplierCriteria;
import vn.tuhoc.vinaeatery.modules.food.repositories.specifications.SupplierSpecification;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    private Boolean existsByPhone(String phone) {
        return this.supplierRepository.existsByPhone(phone);
    }

    private Boolean existsByEmail(String email) {
        return this.supplierRepository.existsByEmail(email);
    }

    private void handleExistsByPhone(String phone) {
        if (this.existsByPhone(phone)) {
            throw new SupplierPhoneIsExistsException(phone);
        }
    }

    private void handleExistsByEmail(String email) {
        if (this.existsByEmail(email)) {
            throw new SupplierEmailIsExistsException(email);
        }
    }

    private SupplierEntity getOneById(Integer id) {
        return this.supplierRepository.findOneById(id)
                .orElseThrow(() -> new SupplierNotFoundByIdException(id));
    }

    private Page<SupplierEntity> getAll(SupplierCriteria supplierCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(supplierCriteria.getSort())) {
            String sortString = supplierCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "fullname__asc" -> sort = Sort.by("fullname").ascending();
                case "fullname__desc" -> sort = Sort.by("fullname").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(supplierCriteria.getPage())
                && ValidationUtil.nonNull(supplierCriteria.getSize())) {
            pageable = PageRequest.of(
                    supplierCriteria.getPage(),
                    supplierCriteria.getSize(),
                    sort);
        }

        Specification<SupplierEntity> specification = SupplierSpecification.filterSuppliers(supplierCriteria);

        return this.supplierRepository.findAll(specification, pageable);
    }

    private List<SupplierEntity> getAllCrud() {
        return this.supplierRepository.findAllCrud();
    }

    private List<SupplierEntity> getAllCrud(Integer restaurantId) {
        return this.supplierRepository.findAllCrud(restaurantId);
    }

    @Cacheable(value = "supplier__detail", key = "#id", unless = "#result == null")
    public SupplierDetailResponseDTO handleGetDetailById(Integer id) {
        return this.supplierMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Cacheable(value = "supplier__summary", key = "#supplierCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<SupplierSummaryResponseDTO> handleGetSummary(SupplierCriteria supplierCriteria) {
        Page<SupplierSummaryResponseDTO> page = this.getAll(supplierCriteria)
                .map(this.supplierMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Cacheable(value = "supplier__crud_all", unless = "#result == null")
    public List<SupplierCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.supplierMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "supplier__crud", key = "#restaurantId", unless = "#result == null")
    public List<SupplierCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream()
                .map(this.supplierMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Caching(evict = {
            @CacheEvict(value = "supplier__detail", key = "#result.id"),
            @CacheEvict(value = "supplier__summary", allEntries = true),
            @CacheEvict(value = "supplier__crud_all", allEntries = true),
            @CacheEvict(value = "supplier__crud", allEntries = true)
    })
    public SupplierDetailResponseDTO handleCreate(SupplierCreateRequestDTO supplierCreateRequestDTO) {
        this.handleExistsByPhone(supplierCreateRequestDTO.getPhone());
        this.handleExistsByEmail(supplierCreateRequestDTO.getEmail());

        SupplierEntity supplierEntity = this.supplierMapper.createEntityFromRequest(supplierCreateRequestDTO);

        return this.supplierMapper.entityToDetailResponse(this.supplierRepository.save(supplierEntity));
    }

    @Caching(put = {
            @CachePut(value = "supplier__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "supplier__summary", allEntries = true),
            @CacheEvict(value = "supplier__crud_all", allEntries = true),
            @CacheEvict(value = "supplier__crud", allEntries = true)
    })
    public SupplierDetailResponseDTO handleUpdate(Integer id, SupplierUpdateRequestDTO supplierUpdateRequestDTO) {
        SupplierEntity supplierEntity = this.getOneById(id);

        String supplierPhoneRequest = supplierUpdateRequestDTO.getPhone();
        String supplierEmailRequest = supplierUpdateRequestDTO.getEmail();
        if (!supplierEntity.getPhone().equals(supplierPhoneRequest)) {
            this.handleExistsByPhone(supplierPhoneRequest);
        }
        if (!supplierEntity.getEmail().equals(supplierEmailRequest)) {
            this.handleExistsByEmail(supplierEmailRequest);
        }

        this.supplierMapper.updateEntityFromRequest(supplierUpdateRequestDTO, supplierEntity);

        return this.supplierMapper.entityToDetailResponse(supplierEntity);
    }

    @Caching(put = {
            @CachePut(value = "supplier__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "supplier__summary", allEntries = true),
            @CacheEvict(value = "supplier__crud_all", allEntries = true),
            @CacheEvict(value = "supplier__crud", allEntries = true)
    })
    public SupplierDetailResponseDTO handleDelete(Integer id, SupplierDeleteRequestDTO supplierDeleteRequestDTO) {
        SupplierEntity supplierEntity = this.getOneById(id);
        this.supplierMapper.deleteEntityFromRequest(supplierDeleteRequestDTO, supplierEntity);

        return this.supplierMapper.entityToDetailResponse(supplierEntity);
    }
}