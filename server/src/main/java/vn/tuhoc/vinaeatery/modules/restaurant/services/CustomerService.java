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
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserMethodEnum;
import vn.tuhoc.vinaeatery.modules.auth.domains.enums.UserRoleEnum;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.UserCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.UserDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.auth.services.UserService;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.services.CloudinaryService;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.CustomerMapper;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerRegisterRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerEmailIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerNotFoundByEmailException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerNotFoundByUserIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerPhoneIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.CustomerRepository;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.CustomerCriteria;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.specifications.CustomerSpecification;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {
    private final UserService userService;
    private final CloudinaryService cloudinaryService;
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    private Boolean existsByPhone(String phone) {
        return this.customerRepository.existsByPhone(phone);
    }

    private Boolean existsByEmail(String email) {
        return this.customerRepository.existsByEmail(email);
    }

    private void handleExistsByPhone(String phone) {
        if (this.existsByPhone(phone)) {
            throw new CustomerPhoneIsExistsException(phone);
        }
    }

    private void handleExistsByEmail(String email) {
        if (this.existsByEmail(email)) {
            throw new CustomerEmailIsExistsException(email);
        }
    }

    private CustomerEntity getOneById(Integer id) {
        return this.customerRepository.findOneById(id)
                .orElseThrow(() -> new CustomerNotFoundByIdException(id));
    }

    private CustomerEntity getOneByUserId(Integer userId) {
        return this.customerRepository.findOneByUserId(userId)
                .orElseThrow(() -> new CustomerNotFoundByUserIdException(userId));
    }

    private CustomerEntity getOneByEmail(String email) {
        return this.customerRepository.findOneByEmail(email)
                .orElseThrow(() -> new CustomerNotFoundByEmailException(email));
    }

    public CustomerEntity getOneByEmailNotThrowException(String email) {
        return this.customerRepository.findOneByEmail(email).orElse(null);
    }

    private Page<CustomerEntity> getAll(CustomerCriteria customerCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(customerCriteria.getSort())) {
            String sortString = customerCriteria.getSort().filter(ValidationUtil::hasText).get();
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
        if (ValidationUtil.nonNull(customerCriteria.getPage())
                && ValidationUtil.nonNull(customerCriteria.getSize())) {
            pageable = PageRequest.of(
                    customerCriteria.getPage(),
                    customerCriteria.getSize(),
                    sort);
        }

        Specification<CustomerEntity> specification = CustomerSpecification.filterCustomers(customerCriteria);

        return this.customerRepository.findAll(specification, pageable);
    }

    private List<CustomerEntity> getAllCrud() {
        return this.customerRepository.findAllCrud();
    }

    @Cacheable(value = "customer__detail", key = "#id", unless = "#result == null")
    public CustomerDetailResponseDTO handleGetDetailById(Integer id) {
        return this.customerMapper.entityToDetailResponse(this.getOneById(id));
    }

    public CustomerDetailResponseDTO handleGetDetailByUserId(Integer userId) {
        return this.customerMapper.entityToDetailResponse(this.getOneByUserId(userId));
    }

    public CustomerDetailResponseDTO handleGetDetailByEmail(String email) {
        return this.customerMapper.entityToDetailResponse(this.getOneByEmail(email));
    }

    @Cacheable(value = "customer__summary", key = "#customerCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<CustomerSummaryResponseDTO> handleGetSummary(CustomerCriteria customerCriteria) {
        Page<CustomerSummaryResponseDTO> page = this.getAll(customerCriteria)
                .map(this.customerMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Cacheable(value = "customer__crud", unless = "#result == null")
    public List<CustomerCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.customerMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Caching(evict = {
            @CacheEvict(value = "customer__detail", key = "#result.id"),
            @CacheEvict(value = "customer__summary", allEntries = true),
            @CacheEvict(value = "customer__crud", allEntries = true)
    })
    public CustomerDetailResponseDTO handleCreate(
            MultipartFile imageFile,
            CustomerCreateRequestDTO customerCreateRequestDTO) {
        this.handleExistsByPhone(customerCreateRequestDTO.getPhone());
        this.handleExistsByEmail(customerCreateRequestDTO.getEmail());

        UserCreateRequestDTO userCreateRequestDTO = UserCreateRequestDTO.builder()
                .role(UserRoleEnum.CUSTOMER)
                .username(customerCreateRequestDTO.getUserUsername())
                .password(customerCreateRequestDTO.getUserPassword())
                .method(UserMethodEnum.HANDMADE)
                .status(CommonStatusEnum.ACTIVE)
                .build();
        UserDetailResponseDTO userDetailResponseDTO = this.userService.handleCreate(userCreateRequestDTO);

        String image = this.cloudinaryService.getImage(imageFile);

        CustomerEntity customerEntity = this.customerMapper
                .createEntityFromRequest(userDetailResponseDTO.getId(), image, customerCreateRequestDTO);

        return this.customerMapper.entityToDetailResponse(this.customerRepository.save(customerEntity));
    }

    public CustomerDetailResponseDTO handleRegister(CustomerRegisterRequestDTO customerRegisterRequestDTO) {
        this.handleExistsByPhone(customerRegisterRequestDTO.getPhone());
        this.handleExistsByEmail(customerRegisterRequestDTO.getEmail());

        CustomerEntity customerEntity = this.customerMapper.createEntityFromRegister(
                customerRegisterRequestDTO.getUserId(),
                customerRegisterRequestDTO.getImage(),
                customerRegisterRequestDTO);

        return this.customerMapper.entityToDetailResponse(this.customerRepository.save(customerEntity));
    }

    @Caching(put = {
            @CachePut(value = "customer__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "customer__summary", allEntries = true),
            @CacheEvict(value = "customer__crud", allEntries = true)
    })
    public CustomerDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile imageFile,
            CustomerUpdateRequestDTO customerUpdateRequestDTO) {
        CustomerEntity customerEntity = this.getOneById(id);

        String customerPhoneRequest = customerUpdateRequestDTO.getPhone();
        String customerEmailRequest = customerUpdateRequestDTO.getEmail();
        if (!customerEntity.getPhone().equals(customerPhoneRequest)) {
            this.handleExistsByPhone(customerPhoneRequest);
        }
        if (!customerEntity.getEmail().equals(customerEmailRequest)) {
            this.handleExistsByEmail(customerEmailRequest);
        }

        String image = this.cloudinaryService.getImage(imageFile);

        this.customerMapper.updateEntityFromRequest(image, customerUpdateRequestDTO, customerEntity);

        return this.customerMapper.entityToDetailResponse(customerEntity);
    }

    @Caching(put = {
            @CachePut(value = "customer__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "customer__summary", allEntries = true),
            @CacheEvict(value = "customer__crud", allEntries = true)
    })
    public CustomerDetailResponseDTO handleDelete(
            Integer id,
            CustomerDeleteRequestDTO customerDeleteRequestDTO) {
        CustomerEntity customerEntity = this.getOneById(id);
        this.customerMapper.deleteEntityFromRequest(customerDeleteRequestDTO, customerEntity);

        return this.customerMapper.entityToDetailResponse(customerEntity);
    }
}