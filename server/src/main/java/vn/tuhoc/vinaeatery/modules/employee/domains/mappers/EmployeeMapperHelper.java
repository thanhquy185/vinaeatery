package vn.tuhoc.vinaeatery.modules.employee.domains.mappers;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetail2ResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.EmployeeSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.EmployeeNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.repositories.EmployeeRepository;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeMapperHelper {
    final EmployeeRepository employeeRepository;
    final EmployeeMapper employeeMapper;

    public EmployeeEntity mapToEntity(Integer id) {
        return this.employeeRepository.findOneByIdToCrud(id)
                .orElseThrow(() -> new EmployeeNotFoundByIdException(id));
    }

    public EmployeeDetailResponseDTO mapToDetailResponse(EmployeeEntity employeeEntity) {
        return this.employeeMapper.entityToDetailResponse(employeeEntity);
    }

    public EmployeeDetail2ResponseDTO mapToDetail2Response(EmployeeEntity employeeEntity) {
        return this.employeeMapper.entityToDetail2Response(employeeEntity);
    }

    public EmployeeSummaryResponseDTO mapToSummaryResponse(EmployeeEntity employeeEntity) {
        return this.employeeMapper.entityToSummaryResponse(employeeEntity);
    }

    public EmployeeCrudResponseDTO mapToCrudResponse(EmployeeEntity employeeEntity) {
        return this.employeeMapper.entityToCrudResponse(employeeEntity);
    }

    public EmployeeInfoResponseDTO mapToInfoResponse(EmployeeEntity employeeEntity) {
        return this.employeeMapper.entityToInfoResponse(employeeEntity);
    }

    public EmployeeSubInfoResponseDTO mapToSubInfoResponse(EmployeeEntity employeeEntity) {
        return this.employeeMapper.entityToSubInfoResponse(employeeEntity);
    }
}