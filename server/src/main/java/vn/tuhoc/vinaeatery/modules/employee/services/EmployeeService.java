package vn.tuhoc.vinaeatery.modules.employee.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
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
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleHistoryEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.EmployeeMapper;
import vn.tuhoc.vinaeatery.modules.employee.domains.mappers.RoleHistoryMapper;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.EmployeeUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.requests.RoleHistoryCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetail2ResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.EmployeeEmailIsExistsException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.EmployeeNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.EmployeeNotFoundByUserIdException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.EmployeePhoneIsExistsException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.RoleHistoryCanNotUpdateOnDayException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.RoleHistoryLatestNotFoundByEmployeeIdException;
import vn.tuhoc.vinaeatery.modules.employee.repositories.EmployeeRepository;
import vn.tuhoc.vinaeatery.modules.employee.repositories.criteria.EmployeeCriteria;
import vn.tuhoc.vinaeatery.modules.employee.repositories.specifications.EmployeeSpecification;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.services.CloudinaryService;
import vn.tuhoc.vinaeatery.modules.global.services.TimeService;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {
    private final CloudinaryService cloudinaryService;
    private final TimeService timeService;
    private final UserService userService;
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final RoleHistoryMapper roleHistoryMapper;

    private Boolean existsByPhone(String phone) {
        return this.employeeRepository.existsByPhone(phone);
    }

    private Boolean existsByEmail(String email) {
        return this.employeeRepository.existsByEmail(email);
    }

    private void handleExistsByPhone(String phone) {
        if (this.existsByPhone(phone)) {
            throw new EmployeePhoneIsExistsException(phone);
        }
    }

    private void handleExistsByEmail(String email) {
        if (this.existsByEmail(email)) {
            throw new EmployeeEmailIsExistsException(email);
        }
    }

    private EmployeeEntity getOneById(Integer id) {
        return this.employeeRepository.findOneById(id)
                .orElseThrow(() -> new EmployeeNotFoundByIdException(id));
    }

    private EmployeeEntity getOneByUserId(Integer userId) {
        return this.employeeRepository.findOneByUserId(userId)
                .orElseThrow(() -> new EmployeeNotFoundByUserIdException(userId));
    }

    private Page<EmployeeEntity> getAll(EmployeeCriteria employeeCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(employeeCriteria.getSort())) {
            String sortString = employeeCriteria.getSort().filter(ValidationUtil::hasText).get();
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
        if (ValidationUtil.nonNull(employeeCriteria.getPage())
                && ValidationUtil.nonNull(employeeCriteria.getSize())) {
            pageable = PageRequest.of(
                    employeeCriteria.getPage(),
                    employeeCriteria.getSize(),
                    sort);
        }

        Specification<EmployeeEntity> specification = EmployeeSpecification.filterEmployees(employeeCriteria);

        return this.employeeRepository.findAll(specification, pageable);
    }

    private List<EmployeeEntity> getAllCrud() {
        return this.employeeRepository.findAllCrud();
    }

    private List<EmployeeEntity> getAllCrud(Integer restaurantId) {
        return this.employeeRepository.findAllCrud(restaurantId);
    }

    @Cacheable(value = "employee__detail", key = "#id", unless = "#result == null")
    public EmployeeDetailResponseDTO handleGetDetailById(Integer id) {
        return this.employeeMapper.entityToDetailResponse(this.getOneById(id));
    }

    public EmployeeDetail2ResponseDTO handleGetDetail2ByUserId(Integer userId) {
        return this.employeeMapper.entityToDetail2Response(this.getOneByUserId(userId));
    }

    @Cacheable(value = "employee__summary", key = "#employeeCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<EmployeeSummaryResponseDTO> handleGetSummary(EmployeeCriteria employeeCriteria) {
        Page<EmployeeSummaryResponseDTO> page = this.getAll(employeeCriteria)
                .map(this.employeeMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Cacheable(value = "employee__crud_all", unless = "#result == null")
    public List<EmployeeCrudResponseDTO> handleGetCrud() {
        return this.getAllCrud().stream()
                .map(this.employeeMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "employee__crud", key = "#restaurantId", unless = "#result == null")
    public List<EmployeeCrudResponseDTO> handleGetCrud(Integer restaurantId) {
        return this.getAllCrud(restaurantId).stream()
                .map(this.employeeMapper::entityToCrudResponse)
                .collect(Collectors.toList());
    }

    @Caching(evict = {
            @CacheEvict(value = "employee__detail", key = "#result.id"),
            @CacheEvict(value = "employee__summary", allEntries = true),
            @CacheEvict(value = "employee__crud_all", allEntries = true),
            @CacheEvict(value = "employee__crud", allEntries = true)
    })
    public EmployeeDetailResponseDTO handleCreate(
            MultipartFile imageFile,
            EmployeeCreateRequestDTO employeeCreateRequestDTO) {
        this.handleExistsByPhone(employeeCreateRequestDTO.getPhone());
        this.handleExistsByEmail(employeeCreateRequestDTO.getEmail());

        UserCreateRequestDTO userCreateRequestDTO = UserCreateRequestDTO.builder()
                .role(UserRoleEnum.EMPLOYEE)
                .username(employeeCreateRequestDTO.getUserUsername())
                .password(employeeCreateRequestDTO.getUserPassword())
                .method(UserMethodEnum.HANDMADE)
                .status(CommonStatusEnum.ACTIVE)
                .build();
        UserDetailResponseDTO userDetailResponseDTO = this.userService.handleCreate(userCreateRequestDTO);

        String image = this.cloudinaryService.getImage(imageFile);

        EmployeeEntity employeeEntity = this.employeeMapper
                .createEntityFromRequest(userDetailResponseDTO.getId(), image, employeeCreateRequestDTO);

        RoleHistoryCreateRequestDTO roleHistoryCreateRequestDTO = RoleHistoryCreateRequestDTO.builder()
                .roleId(employeeCreateRequestDTO.getRoleId())
                .dateStart(this.timeService.getCurrentDate())
                .build();
        RoleHistoryEntity roleHistoryEntity = this.roleHistoryMapper
                .createEntityFromRequest(roleHistoryCreateRequestDTO);
        employeeEntity.addRoleHistory(roleHistoryEntity);

        return this.employeeMapper.entityToDetailResponse(this.employeeRepository.save(employeeEntity));
    }

    @Caching(put = {
            @CachePut(value = "employee__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "employee__summary", allEntries = true),
            @CacheEvict(value = "employee__crud_all", allEntries = true),
            @CacheEvict(value = "employee__crud", allEntries = true)
    })
    public EmployeeDetailResponseDTO handleUpdate(
            Integer id,
            MultipartFile imageFile,
            EmployeeUpdateRequestDTO employeeUpdateRequestDTO) {
        EmployeeEntity employeeEntity = this.getOneById(id);

        String employeePhoneRequest = employeeUpdateRequestDTO.getPhone();
        String employeeEmailRequest = employeeUpdateRequestDTO.getEmail();
        if (!employeeEntity.getPhone().equals(employeePhoneRequest)) {
            this.handleExistsByPhone(employeePhoneRequest);
        }
        if (!employeeEntity.getEmail().equals(employeeEmailRequest)) {
            this.handleExistsByEmail(employeeEmailRequest);
        }

        String image = this.cloudinaryService.getImage(imageFile);

        this.employeeMapper.updateEntityFromRequest(image, employeeUpdateRequestDTO, employeeEntity);

        RoleHistoryEntity currentRole = employeeEntity.getRoleHistories()
                .stream()
                .filter(roleHistory -> roleHistory.getDateEnd() == null)
                .findFirst()
                .orElseThrow(() -> new RoleHistoryLatestNotFoundByEmployeeIdException(id));
        if (!Objects.equals(
                currentRole.getId().getRoleId(),
                employeeUpdateRequestDTO.getRoleId())) {
            String currentDate = this.timeService.getCurrentDate();
            String afterCurrentDate = this.timeService.getDate(LocalDateTime.now().plusDays(1));

            if (currentDate.compareTo(currentRole.getId().getDateStart()) < 0) {
                throw new RoleHistoryCanNotUpdateOnDayException();
            }
            currentRole.setDateEnd(currentDate);

            RoleHistoryCreateRequestDTO roleHistoryCreateRequestDTO = RoleHistoryCreateRequestDTO.builder()
                    .roleId(employeeUpdateRequestDTO.getRoleId())
                    .dateStart(afterCurrentDate)
                    .build();
            RoleHistoryEntity roleHistoryEntity = this.roleHistoryMapper
                    .createEntityFromRequest(roleHistoryCreateRequestDTO);
            employeeEntity.addRoleHistory(roleHistoryEntity);

        }

        return this.employeeMapper.entityToDetailResponse(employeeEntity);
    }

    @Caching(put = {
            @CachePut(value = "employee__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "employee__summary", allEntries = true),
            @CacheEvict(value = "employee__crud_all", allEntries = true),
            @CacheEvict(value = "employee__crud", allEntries = true)
    })
    public EmployeeDetailResponseDTO handleDelete(
            Integer id,
            EmployeeDeleteRequestDTO employeeDeleteRequestDTO) {
        EmployeeEntity employeeEntity = this.getOneById(id);
        this.employeeMapper.deleteEntityFromRequest(employeeDeleteRequestDTO, employeeEntity);

        return this.employeeMapper.entityToDetailResponse(employeeEntity);
    }
}