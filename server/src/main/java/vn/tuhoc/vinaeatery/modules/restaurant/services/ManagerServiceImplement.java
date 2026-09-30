package vn.tuhoc.vinaeatery.modules.restaurant.services;

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

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserMethodEnum;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserRoleEnum;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.services.UserServiceImplement;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.CloudinaryUploadResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.services.CloudinaryService;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.ManagerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.ManagerMapper;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.ManagerUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.ManagerSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerEmailIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerIsUsingException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerNotFoundByUserIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerPhoneIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.ManagerRepository;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.RestaurantRepository;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.ManagerCriteria;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.specifications.ManagerSpecification;
import vn.tuhoc.vinaeatery.modules.restaurant.services.interfaces.ManagerService;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ManagerServiceImplement implements ManagerService {
    final CloudinaryService cloudinaryService;
    final UserServiceImplement userService;
    final ManagerRepository managerRepository;
    final RestaurantRepository restaurantRepository;
    final ManagerMapper managerMapper;

    private Boolean existsByPhone(String phone) {
        return this.managerRepository.existsByPhone(phone);
    }

    private Boolean existsByEmail(String email) {
        return this.managerRepository.existsByEmail(email);
    }

    private void handleExistsByPhone(String phone) {
        if (this.existsByPhone(phone)) {
            throw new ManagerPhoneIsExistsException(phone);
        }
    }

    private void handleExistsByEmail(String email) {
        if (this.existsByEmail(email)) {
            throw new ManagerEmailIsExistsException(email);
        }
    }

    private ManagerEntity getOneById(Integer id) {
        return this.managerRepository.findById(id)
                .orElseThrow(() -> new ManagerNotFoundByIdException(id));
    }

    private ManagerEntity getOneByUserId(Integer userId) {
        return this.managerRepository.findOneByUserId(userId)
                .orElseThrow(() -> new ManagerNotFoundByUserIdException(userId));
    }

    private Page<ManagerEntity> getAll(ManagerCriteria managerCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(managerCriteria.getSort())) {
            String sortString = managerCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "fullname__asc" -> sort = Sort.by("fullname").ascending();
                case "fullname__desc" -> sort = Sort.by("fullname").descending();
                case "birthdate__asc" -> sort = Sort.by("birthdate").ascending();
                case "birthdate__desc" -> sort = Sort.by("birthdate").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(managerCriteria.getPage())
                && ValidationUtil.nonNull(managerCriteria.getSize())) {
            pageable = PageRequest.of(
                    managerCriteria.getPage(),
                    managerCriteria.getSize(),
                    sort);
        }

        Specification<ManagerEntity> specification = ManagerSpecification.filterManagers(managerCriteria);

        return this.managerRepository.findAll(specification, pageable);
    }

    private List<ManagerEntity> getAllCrud() {
        return this.managerRepository.findAllCrud();
    }

    @Override
    @Cacheable(value = "manager__detail", key = "#id", unless = "#result == null")
    public ManagerDetailResponseDTO handleGetDetailById(Integer id) {
        return this.managerMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    public ManagerDetailResponseDTO handleGetDetailByUserId(Integer userId) {
        return this.managerMapper.entityToDetailResponse(this.getOneByUserId(userId));
    }

    @Override
    @Cacheable(value = "manager__summary", key = "#managerCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<ManagerSummaryResponseDTO> handleGetSummary(ManagerCriteria managerCriteria) {
        Page<ManagerSummaryResponseDTO> page = this.getAll(managerCriteria)
                .map(this.managerMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    @Cacheable(value = "manager__crud", unless = "#result == null")
    public List<ManagerCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.managerMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "manager__detail", key = "#result.id"),
            @CacheEvict(value = "manager__summary", allEntries = true),
            @CacheEvict(value = "manager__crud", allEntries = true)
    })
    public ManagerDetailResponseDTO handleCreate(
            MultipartFile imageFile,
            ManagerCreateRequestDTO managerCreateRequestDTO) {
        this.handleExistsByPhone(managerCreateRequestDTO.getPhone());
        this.handleExistsByEmail(managerCreateRequestDTO.getEmail());

        CloudinaryUploadResponseDTO image = this.cloudinaryService.newGetImage(imageFile, "managers");

        UserCreateRequestDTO userCreateRequestDTO = UserCreateRequestDTO.builder()
                .role(UserRoleEnum.MANAGER)
                .username(managerCreateRequestDTO.getUserUsername())
                .password(managerCreateRequestDTO.getUserPassword())
                .method(UserMethodEnum.HANDMADE)
                .status(CommonStatusEnum.ACTIVE)
                .build();
        UserDetailResponseDTO userDetailResponseDTO = this.userService.handleCreate(userCreateRequestDTO);

        ManagerEntity managerEntity = this.managerMapper
                .createEntityFromRequest(
                        userDetailResponseDTO.getId(),
                        ValidationUtil.nonNull(image) ? image.getUrl() : null,
                        ValidationUtil.nonNull(image) ? image.getPublicId() : null,
                        managerCreateRequestDTO);

        return this.managerMapper.entityToDetailResponse(this.managerRepository.save(managerEntity));
    }

    @Override
    @Caching(put = {
            @CachePut(value = "manager__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "manager__summary", allEntries = true),
            @CacheEvict(value = "manager__crud", allEntries = true)
    })
    public ManagerDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile imageFile,
            ManagerUpdateRequestDTO managerUpdateRequestDTO) {
        ManagerEntity managerEntity = this.getOneById(id);

        String managerPhoneRequest = managerUpdateRequestDTO.getPhone();
        String managerEmailRequest = managerUpdateRequestDTO.getEmail();
        if (!managerEntity.getPhone().equals(managerPhoneRequest)) {
            this.handleExistsByPhone(managerPhoneRequest);
        }
        if (!managerEntity.getEmail().equals(managerEmailRequest)) {
            this.handleExistsByEmail(managerEmailRequest);
        }

        CloudinaryUploadResponseDTO image = this.cloudinaryService.newGetImage(imageFile, "managers");
        if (ValidationUtil.nonNull(image)
                && ValidationUtil.nonNull(managerEntity.getImageUrl())
                && ValidationUtil.nonNull(managerEntity.getImagePublicId())) {
            this.cloudinaryService.deleteImage(managerEntity.getImagePublicId());
        }

        this.managerMapper.updateEntityFromRequest(
                ValidationUtil.nonNull(image) ? image.getUrl() : null,
                ValidationUtil.nonNull(image) ? image.getPublicId() : null,
                managerUpdateRequestDTO,
                managerEntity);

        return this.managerMapper.entityToDetailResponse(managerEntity);
    }

    @Override
    @Caching(put = {
            @CachePut(value = "manager__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "manager__summary", allEntries = true),
            @CacheEvict(value = "manager__crud", allEntries = true)
    })
    public ManagerDetailResponseDTO handleDelete(
            Integer id,
            ManagerDeleteRequestDTO managerDeleteRequestDTO) {
        ManagerEntity managerEntity = this.getOneById(id);
        if (this.restaurantRepository.existsByManagerIdAndStatusIsActive(id)) {
            throw new ManagerIsUsingException(id);
        }
        this.managerMapper.deleteEntityFromRequest(managerDeleteRequestDTO,
                managerEntity);

        return this.managerMapper.entityToDetailResponse(managerEntity);
    }
}