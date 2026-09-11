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

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.services.CloudinaryService;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantImageEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantImageMapper;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapper;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantImageCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantImageUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.RestaurantUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantManagerResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantPublicDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantPublicResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.RestaurantEmailIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.RestaurantNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.RestaurantPhoneIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.RestaurantRepository;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.RestaurantCriteria;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.specifications.RestaurantSpecification;
import vn.tuhoc.vinaeatery.modules.restaurant.services.interfaces.RestaurantService;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RestaurantServiceImplement implements RestaurantService {
    final EntityManager entityManager;
    final CloudinaryService cloudinaryService;
    final RestaurantRepository restaurantRepository;
    final RestaurantMapper restaurantMapper;
    final RestaurantImageMapper restaurantImageMapper;

    private Boolean existsByPhone(String phone) {
        return this.restaurantRepository.existsByPhone(phone);
    }

    private Boolean existsByEmail(String email) {
        return this.restaurantRepository.existsByEmail(email);
    }

    private void handleExistsByPhone(String phone) {
        if (this.existsByPhone(phone)) {
            throw new RestaurantPhoneIsExistsException(phone);
        }
    }

    private void handleExistsByEmail(String email) {
        if (this.existsByEmail(email)) {
            throw new RestaurantEmailIsExistsException(email);
        }
    }

    private RestaurantEntity getOneById(Integer id) {
        return this.restaurantRepository.findOneById(id)
                .orElseThrow(() -> new RestaurantNotFoundByIdException(id));
    }

    private Page<RestaurantEntity> getAll(RestaurantCriteria restaurantCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(restaurantCriteria.getSort())) {
            String sortString = restaurantCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "name__asc" -> sort = Sort.by("name").ascending();
                case "name__desc" -> sort = Sort.by("name").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(restaurantCriteria.getPage())
                && ValidationUtil.nonNull(restaurantCriteria.getSize())) {
            pageable = PageRequest.of(
                    restaurantCriteria.getPage(),
                    restaurantCriteria.getSize(),
                    sort);
        }

        Specification<RestaurantEntity> specification = RestaurantSpecification.filterRestaurants(restaurantCriteria);

        return this.restaurantRepository.findAll(specification, pageable);
    }

    private List<RestaurantEntity> getAllByManagerId(Integer managerId) {
        return this.restaurantRepository.findAllByManagerId(managerId);
    }

    private List<RestaurantEntity> getAllCrud() {
        return this.restaurantRepository.findAllCrud();
    }

    @Override
    @Cacheable(value = "restaurant__detail", key = "#id", unless = "#result == null")
    public RestaurantDetailResponseDTO handleGetDetailById(Integer id) {
        return this.restaurantMapper.entityToDetailResponse(this.getOneById(id));
    }

    @Override
    @Cacheable(value = "restaurant__public_detail", key = "#id", unless = "#result == null")
    public RestaurantPublicDetailResponseDTO handleGetPublicDetailById(Integer id) {
        return this.restaurantMapper.entityToPublicDetailResponse(this.getOneById(id));
    }

    @Override
    @Cacheable(value = "restaurant__summary", key = "#restaurantCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<RestaurantSummaryResponseDTO> handleGetSummary(RestaurantCriteria restaurantCriteria) {
        Page<RestaurantSummaryResponseDTO> page = this.getAll(restaurantCriteria)
                .map(this.restaurantMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    @Cacheable(value = "restaurant__public_summary", key = "#restaurantCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<RestaurantPublicResponseDTO> handleGetPublic(RestaurantCriteria restaurantCriteria) {
        Page<RestaurantPublicResponseDTO> page = this.getAll(restaurantCriteria)
                .map(this.restaurantMapper::entityToPublicResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    public List<RestaurantManagerResponseDTO> handleGetAllByManagerId(Integer managerId) {
        return this.getAllByManagerId(managerId).stream().map(this.restaurantMapper::entityToManagerResponse).toList();
    }

    @Override
    @Cacheable(value = "restaurant__crud", unless = "#result == null")
    public List<RestaurantCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.restaurantMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "restaurant__detail", key = "#result.id"),
            @CacheEvict(value = "restaurant__summary", allEntries = true),
            @CacheEvict(value = "restaurant__crud", allEntries = true),
            @CacheEvict(value = "restaurant__public_detail", key = "#result.id"),
            @CacheEvict(value = "restaurant__public_summary", allEntries = true)
    })
    public RestaurantDetailResponseDTO handleCreate(
            MultipartFile[] imageFiles,
            RestaurantCreateRequestDTO restaurantCreateRequestDTO) {
        this.handleExistsByPhone(restaurantCreateRequestDTO.getPhone());
        this.handleExistsByEmail(restaurantCreateRequestDTO.getEmail());

        RestaurantEntity restaurantEntity = this.restaurantMapper.createEntityFromRequest(restaurantCreateRequestDTO);

        List.of(imageFiles).stream().forEach((imageFile) -> {
            String image = this.cloudinaryService.getImage(imageFile);
            RestaurantImageCreateRequestDTO restaurantImageCreateRequestDTO = RestaurantImageCreateRequestDTO.builder()
                    .image(image)
                    .build();
            RestaurantImageEntity restaurantImageEntity = this.restaurantImageMapper
                    .createEntityFromRequest(restaurantImageCreateRequestDTO);

            restaurantEntity.addRestaurantImage(restaurantImageEntity);
        });

        return this.restaurantMapper.entityToDetailResponse(this.restaurantRepository.save(restaurantEntity));
    }

    @Override
    @Caching(put = {
            @CachePut(value = "restaurant__detail", key = "#id"),
            @CachePut(value = "restaurant__public_detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "restaurant__summary", allEntries = true),
            @CacheEvict(value = "restaurant__crud", allEntries = true),
            @CacheEvict(value = "restaurant__public_summary", allEntries = true),
    })
    public RestaurantDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile[] imageFiles,
            RestaurantUpdateRequestDTO restaurantUpdateRequestDTO) {
        RestaurantEntity restaurantEntity = this.getOneById(id);

        String restaurantPhoneRequest = restaurantUpdateRequestDTO.getPhone();
        String restaurantEmailRequest = restaurantUpdateRequestDTO.getEmail();
        if (!restaurantEntity.getPhone().equals(restaurantPhoneRequest)) {
            this.handleExistsByPhone(restaurantPhoneRequest);
        }
        if (!restaurantEntity.getEmail().equals(restaurantEmailRequest)) {
            this.handleExistsByEmail(restaurantEmailRequest);
        }

        this.restaurantMapper.updateEntityFromRequest(restaurantUpdateRequestDTO, restaurantEntity);

        restaurantEntity.getRestaurantImages().clear();
        this.entityManager.flush();

        List.of(imageFiles).stream().forEach((imageFile) -> {
            String image = this.cloudinaryService.getImage(imageFile);
            RestaurantImageUpdateRequestDTO restaurantImageUpdateRequestDTO = RestaurantImageUpdateRequestDTO.builder()
                    .image(image)
                    .build();
            RestaurantImageEntity restaurantImageEntity = this.restaurantImageMapper
                    .createEntityFromRequest(restaurantImageUpdateRequestDTO);

            restaurantEntity.addRestaurantImage(restaurantImageEntity);
        });

        return this.restaurantMapper.entityToDetailResponse(restaurantEntity);
    }

    @Override
    @Caching(put = {
            @CachePut(value = "restaurant__detail", key = "#id"),
            @CachePut(value = "restaurant__public_detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "restaurant__summary", allEntries = true),
            @CacheEvict(value = "restaurant__crud", allEntries = true),
            @CacheEvict(value = "restaurant__public_summary", allEntries = true),
    })
    public RestaurantDetailResponseDTO handleDelete(
            Integer id,
            RestaurantDeleteRequestDTO restaurantDeleteRequestDTO) {
        RestaurantEntity restaurantEntity = this.getOneById(id);
        this.restaurantMapper.deleteEntityFromRequest(restaurantDeleteRequestDTO, restaurantEntity);

        return this.restaurantMapper.entityToDetailResponse(restaurantEntity);
    }
}