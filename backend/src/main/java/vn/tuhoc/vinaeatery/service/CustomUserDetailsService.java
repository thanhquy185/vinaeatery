package vn.tuhoc.vinaeatery.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Employee;
import vn.tuhoc.vinaeatery.repository.RoleHistoryRepository;
import vn.tuhoc.vinaeatery.repository.RoleRepository;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    // Properties
    private final EmployeeService employeeService;
    private final RoleRepository roleRepository;
    private final RoleHistoryRepository roleHistoryRepository;

    // Methods
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee employee = employeeService.getOneByUsername(username);
        if (employee == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return org.springframework.security.core.userdetails.User
                .withUsername(employee.getUsername())
                .password(employee.getPassword())
                .authorities("ROLE_" + roleRepository
                        .findOneById(roleHistoryRepository.findNewByEmployeeId(employee.getId()).getId().getRoleId())) // tuỳ
                                                                                                                       // quyền
                                                                                                                       // của
                                                                                                                       // bạn
                .build();
    }
}
