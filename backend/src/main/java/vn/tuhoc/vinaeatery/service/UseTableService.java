package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.UseTable;
import vn.tuhoc.vinaeatery.domain.UseTable_;
import vn.tuhoc.vinaeatery.domain.criteria.UseTableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.UseTableDTO;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.repository.UseTableRepository;
import vn.tuhoc.vinaeatery.service.specification.UseTableSpecification;

@Service
@AllArgsConstructor
public class UseTableService {
    // Properties
    private final OrderSheetService orderSheetService;
    private final OrderService orderService;
    private final OrderTableService orderTableService;
    private final CustomerService customerService;
    private final TableService tableService;
    private final EmployeeService employeeService;
    private final UseTableRepository useTableRepository;

    // Methods
    public UseTable getOneById(Long id) {
        return this.useTableRepository.findOneById(id);
    }

    public UseTableDTO getNewOneFormatByTableId(Integer tableId) {
        UseTableDTO useTableDTO = new UseTableDTO();
        UseTable useTable = this.useTableRepository.findNewOneByTableId(tableId);
        if (useTable != null) {
            useTableDTO.setId(useTable.getId());
            useTableDTO.setTimeStart(useTable.getTimeStart());
            useTableDTO.setTimeEnd(useTable.getTimeEnd());
            if (useTable.getTableId() != null) {
                useTableDTO.setTable(tableService.getOneFormatById(useTable.getTableId()));
            }
            if (useTable.getEmployeeId() != null) {
                useTableDTO.setEmployee(employeeService.getOneFormatById(useTable.getEmployeeId()));
            }
            if (useTable.getCustomerId() != null) {
                useTableDTO.setCustomer(customerService.getOneFormatById(useTable.getCustomerId()));
            }
            if (useTable.getOrderId() != null) {
                useTableDTO.setOrder(orderService.getOneFormatById(useTable.getOrderId()));
            }
            if (useTable.getOrderTableId() != null) {
                useTableDTO.setOrderTable(orderTableService.getOneFormatById(useTable.getOrderTableId()));
            }
            useTableDTO.setStatus(useTable.getStatus());
            useTableDTO.setOrderSheets(orderSheetService.getAllFormatWithUseTable(useTable.getTableId()));
        }

        return useTableDTO;
    }

    public UseTableDTO getOneFormatById(Long id) {
        UseTableDTO useTableDTO = new UseTableDTO();
        UseTable useTable = this.useTableRepository.findOneById(id);
        if (useTable != null) {
            useTableDTO.setId(useTable.getId());
            useTableDTO.setTimeStart(useTable.getTimeStart());
            useTableDTO.setTimeEnd(useTable.getTimeEnd());
            if (useTable.getTableId() != null) {
                useTableDTO.setTable(tableService.getOneFormatById(useTable.getTableId()));
            }
            if (useTable.getEmployeeId() != null) {
                useTableDTO.setEmployee(employeeService.getOneFormatById(useTable.getEmployeeId()));
            }
            if (useTable.getCustomerId() != null) {
                useTableDTO.setCustomer(customerService.getOneFormatById(useTable.getCustomerId()));
            }
            if (useTable.getOrderId() != null) {
                useTableDTO.setOrder(orderService.getOneFormatById(useTable.getOrderId()));
            }
            if (useTable.getOrderTableId() != null) {
                useTableDTO.setOrderTable(orderTableService.getOneFormatById(useTable.getOrderTableId()));
            }
            useTableDTO.setStatus(useTable.getStatus());
            useTableDTO.setOrderSheets(orderSheetService.getAllFormatWithUseTable(useTable.getTableId()));
        }

        return useTableDTO;
    }

    public List<UseTable> getAll() {
        return this.useTableRepository.findAll();
    }

    public UseTable getNewOneByCustomerId(Integer customerId) {
        return this.useTableRepository.findNewOneByCustomerId(customerId);
    }

    public UseTable getNewOneByOrderTableId(Integer orderTableId) {
        return this.useTableRepository.findNewOneByOrderTableId(orderTableId);
    }

    public List<UseTable> getAll(UseTableCriteria useTableCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (useTableCriteria.getSort() != null && useTableCriteria.getSort().isPresent()) {
            String sortStr = useTableCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(UseTable_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(UseTable_.ID).descending();
                case "Thời gian bắt đầu tăng dần" -> sort = Sort.by(UseTable_.TIME_START).ascending();
                case "Thời gian bắt đầu giảm dần" -> sort = Sort.by(UseTable_.TIME_START).descending();
                case "Thời gian kết thúc tăng dần" -> sort = Sort.by(UseTable_.TIME_END).ascending();
                case "Thời gian kết thúc giảm dần" -> sort = Sort.by(UseTable_.TIME_END).descending();
            }
        }

        //
        if (useTableCriteria.getId() == null && useTableCriteria.getTimeStart() == null
                && useTableCriteria.getTimeEnd() == null
                && useTableCriteria.getTableId() == null
                && useTableCriteria.getFloorId() == null
                && useTableCriteria.getEmployeeId() == null
                && useTableCriteria.getCustomerId() == null
                && useTableCriteria.getOrderId() == null
                && useTableCriteria.getOrderTableId() == null
                && useTableCriteria.getStatus() == null
                && useTableCriteria.getSort() == null) {
            return this.useTableRepository.findAll();
        }

        //
        Specification<UseTable> combinedSpec = Specification.where(null);
        if (useTableCriteria.getId() != null && useTableCriteria.getId().isPresent()) {
            if (useTableCriteria.getId().get().matches("\\d+")) {
                Specification<UseTable> currentSpec = UseTableSpecification
                        .idEqual(useTableCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useTableCriteria.getTimeStart() != null && useTableCriteria.getTimeStart().isPresent()) {
            Specification<UseTable> currentSpec = UseTableSpecification
                    .timeAfter(useTableCriteria.getTimeStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (useTableCriteria.getTimeEnd() != null && useTableCriteria.getTimeEnd().isPresent()) {
            if (!useTableCriteria.getTimeEnd().get().equals("null")) {
                Specification<UseTable> currentSpec = UseTableSpecification
                        .timeBefore(useTableCriteria.getTimeEnd().get());
                combinedSpec = combinedSpec.and(currentSpec);
            } else {
                sort = Sort.by(UseTable_.TABLE_ID).ascending();
                Specification<UseTable> currentSpec = UseTableSpecification.timeEndIsNull();
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useTableCriteria.getTableId() != null && useTableCriteria.getTableId().isPresent()) {
            if (useTableCriteria.getTableId().get().matches("\\d+")) {
                Specification<UseTable> currentSpec = UseTableSpecification
                        .tableIdEqual(useTableCriteria.getTableId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useTableCriteria.getFloorId() != null && useTableCriteria.getFloorId().isPresent()) {
            if (useTableCriteria.getFloorId().get().matches("\\d+")) {
                Specification<UseTable> currentSpec = UseTableSpecification
                        .floorIdEqual(useTableCriteria.getFloorId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useTableCriteria.getEmployeeId() != null && useTableCriteria.getEmployeeId().isPresent()) {
            if (useTableCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<UseTable> currentSpec = UseTableSpecification
                        .employeeIdEqual(useTableCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useTableCriteria.getCustomerId() != null && useTableCriteria.getCustomerId().isPresent()) {
            if (useTableCriteria.getCustomerId().get().matches("\\d+")) {
                Specification<UseTable> currentSpec = UseTableSpecification
                        .customerIdEqual(useTableCriteria.getCustomerId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useTableCriteria.getOrderId() != null && useTableCriteria.getOrderId().isPresent()) {
            if (useTableCriteria.getOrderId().get().matches("\\d+")) {
                Specification<UseTable> currentSpec = UseTableSpecification
                        .orderIdEqual(useTableCriteria.getOrderId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useTableCriteria.getOrderTableId() != null && useTableCriteria.getOrderTableId().isPresent()) {
            if (useTableCriteria.getOrderTableId().get().matches("\\d+")) {
                Specification<UseTable> currentSpec = UseTableSpecification
                        .orderTableIdEqual(useTableCriteria.getOrderTableId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (useTableCriteria.getStatus() != null && useTableCriteria.getStatus().isPresent()) {
            String statusString = useTableCriteria.getStatus().get();
            Integer statusInteger = 0;
            for (UseTableStatusEnum useTableStatus : UseTableStatusEnum.values()) {
                if (useTableStatus.getDescription().equals(statusString)) {
                    statusInteger = useTableStatus.getValue();
                    break;
                }
            }
            Specification<UseTable> currentSpec = UseTableSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.useTableRepository.findAll(combinedSpec, sort);
    }

    public List<UseTableDTO> getAllFormat(UseTableCriteria useTableCriteria) {
        List<UseTableDTO> listFormat = new ArrayList<>();
        for (UseTable useTable : getAll(useTableCriteria)) {
            UseTableDTO useTableDTO = new UseTableDTO();
            useTableDTO.setId(useTable.getId());
            useTableDTO.setTimeStart(useTable.getTimeStart());
            useTableDTO.setTimeEnd(useTable.getTimeEnd());
            if (useTable.getTableId() != null) {
                useTableDTO.setTable(tableService.getOneFormatById(useTable.getTableId()));
            }
            if (useTable.getEmployeeId() != null) {
                useTableDTO.setEmployee(employeeService.getOneFormatById(useTable.getEmployeeId()));
            }
            if (useTable.getCustomerId() != null) {
                useTableDTO.setCustomer(customerService.getOneFormatById(useTable.getCustomerId()));
            }
            if (useTable.getOrderId() != null) {
                useTableDTO.setOrder(orderService.getOneFormatById(useTable.getOrderId()));
            }
            if (useTable.getOrderTableId() != null) {
                useTableDTO.setOrderTable(orderTableService.getOneFormatById(useTable.getOrderTableId()));
            }
            useTableDTO.setStatus(useTable.getStatus());
            useTableDTO.setOrderSheets(orderSheetService.getAllFormatWithUseTable(useTable.getTableId()));

            listFormat.add(useTableDTO);
        }

        return listFormat;
    }

    public UseTable upsert(UseTable UseTable) {
        return this.useTableRepository.save(UseTable);
    }
}