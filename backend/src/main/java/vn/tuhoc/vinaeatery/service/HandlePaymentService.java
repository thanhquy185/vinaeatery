package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.HandlePayment;
import vn.tuhoc.vinaeatery.domain.HandlePayment_;
import vn.tuhoc.vinaeatery.domain.criteria.HandlePaymentCriteria;
import vn.tuhoc.vinaeatery.domain.dto.HandlePaymentDTO;
import vn.tuhoc.vinaeatery.domain.enumm.HandlePaymentStatusEnum;
import vn.tuhoc.vinaeatery.repository.HandlePaymentRepository;
import vn.tuhoc.vinaeatery.service.specification.HandlePaymentSpecification;

@Service
@RequiredArgsConstructor
public class HandlePaymentService {
    // Properties
    private final UseTableService useTableService;
    private final EmployeeService employeeService;
    private final PayMethodService payMethodService;
    private final HandlePaymentRepository handlePaymentRepository;

    // Methods
    public HandlePayment getOne() {
        return this.handlePaymentRepository.findAll().get(0);
    }

    public HandlePayment getOneById(Integer id) {
        return this.handlePaymentRepository.findOneById(id);
    }

    public HandlePaymentDTO getOneFormatById(Integer id) {
        HandlePaymentDTO handlePaymentDTO = new HandlePaymentDTO();
        HandlePayment handlePayment = this.handlePaymentRepository.findOneById(id);
        if (handlePayment != null) {
            handlePaymentDTO.setUseTable(useTableService.getOneFormatById(handlePayment.getUseTableId()));
            handlePaymentDTO.setEmployee(employeeService.getOneFormatById(handlePayment.getEmployeeId()));
            handlePaymentDTO.setPayMethod(payMethodService.getOneById(handlePayment.getPayMethodId()));
            handlePaymentDTO.setPayTotalPrice(handlePayment.getPayTotalPrice());
            handlePaymentDTO.setStatus(handlePayment.getStatus());
        }

        return handlePaymentDTO;
    }

    public HandlePaymentDTO getOneFormat() {
        return getOneFormatById(this.handlePaymentRepository.findAll().get(0).getId());
    }

    public List<HandlePayment> getAll() {
        return this.handlePaymentRepository.findAll();
    }

    public List<HandlePayment> getAll(HandlePaymentCriteria handlePaymentCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (handlePaymentCriteria.getSort() != null && handlePaymentCriteria.getSort().isPresent()) {
            String sortStr = handlePaymentCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(HandlePayment_.USE_TABLE_ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(HandlePayment_.USE_TABLE_ID).descending();
            }
        }

        //
        if (handlePaymentCriteria.getId() == null
                && handlePaymentCriteria.getStatus() == null
                && handlePaymentCriteria.getSort() == null) {
            return this.handlePaymentRepository.findAll();
        }

        //
        Specification<HandlePayment> combinedSpec = Specification.where(null);
        if (handlePaymentCriteria.getId() != null && handlePaymentCriteria.getId().isPresent()) {
            if (handlePaymentCriteria.getId().get().matches("\\d+")) {
                Specification<HandlePayment> currentSpec = HandlePaymentSpecification
                        .idEqual(handlePaymentCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (handlePaymentCriteria.getStatus() != null && handlePaymentCriteria.getStatus().isPresent()) {
            String statusString = handlePaymentCriteria.getStatus().get();
            Integer statusInteger = 0;
            for (HandlePaymentStatusEnum handlePaymentStatus : HandlePaymentStatusEnum.values()) {
                if (handlePaymentStatus.getDescription().equals(statusString)) {
                    statusInteger = handlePaymentStatus.getValue();
                    break;
                }
            }
            Specification<HandlePayment> currentSpec = HandlePaymentSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.handlePaymentRepository.findAll(combinedSpec, sort);
    }

    public List<HandlePaymentDTO> getAllFormat(HandlePaymentCriteria handlePaymentCriteria) {
        List<HandlePaymentDTO> listFormat = new ArrayList<>();
        for (HandlePayment handlePayment : getAll(handlePaymentCriteria)) {
            listFormat.add(getOneFormatById(handlePayment.getId()));
        }

        return listFormat;
    }

    public HandlePayment upsert(HandlePayment handlePayment) {
        return this.handlePaymentRepository.save(handlePayment);
    }
}
