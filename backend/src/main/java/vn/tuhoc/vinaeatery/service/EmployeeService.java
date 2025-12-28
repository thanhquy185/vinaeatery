package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.EmployeeCriteria;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeDTO;
import vn.tuhoc.vinaeatery.domain.dto.RoleHistoryDTO;
import vn.tuhoc.vinaeatery.domain.entity.Employee;
import vn.tuhoc.vinaeatery.domain.entity.Employee_;
import vn.tuhoc.vinaeatery.domain.entity.RoleHistory;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.EmployeeRepository;
import vn.tuhoc.vinaeatery.repository.RoleHistoryRepository;
import vn.tuhoc.vinaeatery.repository.RoleRepository;
import vn.tuhoc.vinaeatery.service.specification.EmployeeSpecification;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    // Properties
    private final RestaurantService restaurantService;
    private final UserService userService;
    private final RoleService roleService;
    private final RoleRepository roleRepository;
    private final RoleHistoryRepository roleHistoryRepository;
    private final EmployeeRepository employeeRepository;

    // Methods
    public Employee getOneById(Integer id) {
        return this.employeeRepository.findOneById(id);
    }

    public EmployeeDTO getOneByUserId(Integer userid) {
        return getOneFormatById(this.employeeRepository.findOneByUserId(userid).getId());
    }

    public EmployeeDTO getOneFormatById(Integer id) {
        Employee employee = getOneById(id);
        EmployeeDTO employeeDTO = new EmployeeDTO();

        if (employee != null) {
            List<RoleHistoryDTO> roleHistories = new ArrayList<>();
            for (RoleHistory roleHistory : roleHistoryRepository.findAllByEmployeeId(employee.getId())) {
                roleHistories.add(new RoleHistoryDTO(
                        employee.getId(),
                        roleHistory.getId().getRoleId(),
                        this.roleRepository.findOneById(roleHistory.getId().getRoleId()).getName(),
                        roleHistory.getId().getDateBegin(),
                        roleHistory.getDateEnd()));
            }

            employeeDTO.setId(employee.getId());
            // employeeDTO.setRestaurant(this.restaurantService.getOneFormatById(employee.getRestaurantId()));
            employeeDTO.setRestaurantId(employee.getRestaurantId());
            employeeDTO.setUser(this.userService.getOneById(employee.getUserId()));
            employeeDTO.setImage(employee.getImage());
            employeeDTO.setFullname(employee.getFullname());
            employeeDTO.setBirthday(employee.getBirthday());
            employeeDTO.setGender(employee.getGender());
            employeeDTO.setPhone(employee.getPhone());
            employeeDTO.setEmail(employee.getEmail());
            employeeDTO.setAddress(employee.getAddress());
            employeeDTO.setDateBegin(employee.getDateBegin());
            employeeDTO.setDateEnd(employee.getDateEnd());
            if (this.roleHistoryRepository.findNewByEmployeeId(employee.getId()).getId().getRoleId() != null) {
                // employeeDTO.setCurrentRole(roleRepository
                // .findOneById(this.roleHistoryRepository.findNewByEmployeeId(employee.getId()).getId().getRoleId()));
                employeeDTO.setCurrentRole(roleService.getOneFormatById(
                        this.roleHistoryRepository.findNewByEmployeeId(employee.getId()).getId().getRoleId()));
            }
            employeeDTO.setRoleHistories(roleHistories);
            // employeeDTO.setUsername(employee.getUsername());
            employeeDTO.setStatus(employee.getStatus());
            employeeDTO.setUpdateAt(employee.getUpdateAt());
        }

        return employeeDTO;
    }

    public List<Employee> getAll() {
        return this.employeeRepository.findAll();
    }

    public List<Employee> getAll(EmployeeCriteria employeeCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (employeeCriteria.getSort() != null && employeeCriteria.getSort().isPresent()) {
            String sortStr = employeeCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(Employee_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(Employee_.ID).descending();
                case "Họ và tên tăng dần" -> sort = Sort.by(Employee_.FULLNAME).ascending();
                case "Họ và tên giảm dần" -> sort = Sort.by(Employee_.FULLNAME).descending();
            }
        }

        //
        if (employeeCriteria.getId() == null
                && employeeCriteria.getRestaurantId() == null
                && employeeCriteria.getFullname() == null
                && employeeCriteria.getPhone() == null
                && employeeCriteria.getEmail() == null
                && employeeCriteria.getRoleId() == null
                && employeeCriteria.getStatus() == null
                && employeeCriteria.getSort() == null) {
            return this.employeeRepository.findAll(sort);
        }

        //
        Specification<Employee> combinedSpec = Specification.where(null);
        if (employeeCriteria.getId() != null && employeeCriteria.getId().isPresent()) {
            if (employeeCriteria.getId().get().matches("\\d+")) {
                Specification<Employee> currentSpec = EmployeeSpecification.idEqual(employeeCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (employeeCriteria.getRestaurantId() != null && employeeCriteria.getRestaurantId().isPresent()) {
            if (employeeCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<Employee> currentSpec = EmployeeSpecification
                        .restaurantIdEqual(employeeCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (employeeCriteria.getFullname() != null && employeeCriteria.getFullname().isPresent()) {
            Specification<Employee> currentSpec = EmployeeSpecification
                    .fullnameLike(employeeCriteria.getFullname().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (employeeCriteria.getPhone() != null && employeeCriteria.getPhone().isPresent()) {
            if (employeeCriteria.getPhone().get().matches("\\d+")) {
                Specification<Employee> currentSpec = EmployeeSpecification
                        .phoneLike(employeeCriteria.getPhone().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (employeeCriteria.getEmail() != null && employeeCriteria.getEmail().isPresent()) {
            Specification<Employee> currentSpec = EmployeeSpecification.emailLike(employeeCriteria.getEmail().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (employeeCriteria.getRoleId() != null &&
                employeeCriteria.getRoleId().isPresent()) {
            String[] listRoleId = employeeCriteria.getRoleId().get().split(",");
            for (String roleId : listRoleId) {
                System.out.println(roleId);
                if (roleId.matches("\\d+")) {
                    Specification<Employee> currentSpec = EmployeeSpecification.roleIdEqual(roleId);
                    combinedSpec = combinedSpec.or(currentSpec);
                }
            }
        }
        if (employeeCriteria.getStatus() != null && employeeCriteria.getStatus().isPresent()) {
            String statusString = employeeCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Employee> currentSpec = EmployeeSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.employeeRepository.findAll(combinedSpec, sort);
    }

    public List<EmployeeDTO> getAllFormat(EmployeeCriteria employeeCriteria) {
        List<EmployeeDTO> listFormat = new ArrayList<>();
        for (Employee employee : getAll(employeeCriteria)) {
            EmployeeDTO employeeDTO = getOneFormatById(employee.getId());
            listFormat.add(employeeDTO);
        }

        return listFormat;
    }

    public Employee upsert(Employee employee) {
        return this.employeeRepository.save(employee);
    }

    public void deleteById(Integer id) {
        this.employeeRepository.deleteById(id);
    }

    public void lock(Employee employeeLocked) {
        this.employeeRepository.save(employeeLocked);
    }
}