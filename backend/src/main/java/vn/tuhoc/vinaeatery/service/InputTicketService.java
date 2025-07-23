package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.InputTicket;
import vn.tuhoc.vinaeatery.domain.InputTicketDetail;
import vn.tuhoc.vinaeatery.domain.InputTicket_;
import vn.tuhoc.vinaeatery.domain.criteria.InputTicketCriteria;
import vn.tuhoc.vinaeatery.domain.dto.InputTicketDTO;
import vn.tuhoc.vinaeatery.domain.dto.InputTicketDetailDTO;
import vn.tuhoc.vinaeatery.domain.enumm.InputTicketStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.repository.InputTicketDetailRepository;
import vn.tuhoc.vinaeatery.repository.InputTicketRepository;
import vn.tuhoc.vinaeatery.repository.SupplierRepository;
import vn.tuhoc.vinaeatery.service.specification.InputTicketSpecification;

@Service
@AllArgsConstructor
public class InputTicketService {
    // Properties
    private final IngredientService ingredientService;
    private final EmployeeService employeeService;
    private final InputTicketRepository inputTicketRepository;
    private final InputTicketDetailRepository inputTicketDetailRepository;
    private final SupplierRepository supplierRepository;

    // Methods
    public InputTicket getOneById(Integer id) {
        return this.inputTicketRepository.findOneById(id);
    }

    public List<InputTicket> getAll() {
        return this.inputTicketRepository.findAll();
    }

    public List<InputTicket> getAll(InputTicketCriteria inputTicketCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (inputTicketCriteria.getSort() != null && inputTicketCriteria.getSort().isPresent()) {
            String sortStr = inputTicketCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(InputTicket_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(InputTicket_.ID).descending();
                case "Thời gian tạo phiếu tăng dần" -> sort = Sort.by(InputTicket_.TIME_CREATE).ascending();
                case "Thời gian tạo phiếu giảm dần" -> sort = Sort.by(InputTicket_.TIME_CREATE).descending();
                case "Tổng thanh toán tăng dần" -> sort = Sort.by(InputTicket_.TOTAL_PRICE).ascending();
                case "Tổng thanh toán giảm dần" -> sort = Sort.by(InputTicket_.TOTAL_PRICE).descending();
            }
        }

        //
        if (inputTicketCriteria.getId() == null && inputTicketCriteria.getTimeCreateStart() == null
                && inputTicketCriteria.getTimeCreateEnd() == null
                && inputTicketCriteria.getEmployeeId() == null
                && inputTicketCriteria.getSupplierId() == null
                && inputTicketCriteria.getStatusMerge() == null
                && inputTicketCriteria.getPayStatus() == null
                && inputTicketCriteria.getStatus() == null
                && inputTicketCriteria.getSort() == null) {
            return this.inputTicketRepository.findAll();
        }

        //
        Specification<InputTicket> combinedSpec = Specification.where(null);
        if (inputTicketCriteria.getId() != null && inputTicketCriteria.getId().isPresent()) {
            if (inputTicketCriteria.getId().get().matches("\\d+")) {
                Specification<InputTicket> currentSpec = InputTicketSpecification
                        .idEqual(inputTicketCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (inputTicketCriteria.getTimeCreateStart() != null && inputTicketCriteria.getTimeCreateStart().isPresent()) {
            Specification<InputTicket> currentSpec = InputTicketSpecification
                    .timeCreateAfter(inputTicketCriteria.getTimeCreateStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (inputTicketCriteria.getTimeCreateEnd() != null && inputTicketCriteria.getTimeCreateEnd().isPresent()) {
            Specification<InputTicket> currentSpec = InputTicketSpecification
                    .timeCreateBefore(inputTicketCriteria.getTimeCreateEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (inputTicketCriteria.getEmployeeId() != null && inputTicketCriteria.getEmployeeId().isPresent()) {
            if (inputTicketCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<InputTicket> currentSpec = InputTicketSpecification
                .employeeIdEqual(inputTicketCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (inputTicketCriteria.getSupplierId() != null && inputTicketCriteria.getSupplierId().isPresent()) {
            if (inputTicketCriteria.getSupplierId().get().matches("\\d+")) {
                Specification<InputTicket> currentSpec = InputTicketSpecification
                        .supplierIdEqual(inputTicketCriteria.getSupplierId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (inputTicketCriteria.getStatusMerge() != null && inputTicketCriteria.getStatusMerge().isPresent()) {
            String[] statusMergeArray = inputTicketCriteria.getStatusMerge().get().split(",");
            for (String statusMerge : statusMergeArray) {
                // - Pay Status
                Boolean payStatusBoolean = null;
                for (PayStatusEnum payStatus : PayStatusEnum.values()) {
                    if (payStatus.getDescription().equals(statusMerge)) {
                        payStatusBoolean = payStatus.getValue();
                        break;
                    }
                }
                // - Status
                Integer statusInteger = null;
                for (InputTicketStatusEnum inputTicketStatus : InputTicketStatusEnum.values()) {
                    if (inputTicketStatus.getDescription().equals(statusMerge)) {
                        statusInteger = inputTicketStatus.getValue();
                        break;
                    }
                }

                Specification<InputTicket> currentSpec = payStatusBoolean != null && statusInteger == null
                        ? InputTicketSpecification.payStatusEqual(payStatusBoolean)
                        : InputTicketSpecification.statusEqual(statusInteger);
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (inputTicketCriteria.getPayStatus() != null && inputTicketCriteria.getPayStatus().isPresent()) {
            String payStatusString = inputTicketCriteria.getPayStatus().get();
            Boolean payStatusBoolean = false;
            for (PayStatusEnum payStatus : PayStatusEnum.values()) {
                if (payStatus.getDescription().equals(payStatusString)) {
                    payStatusBoolean = payStatus.getValue();
                    break;
                }
            }
            Specification<InputTicket> currentSpec = InputTicketSpecification.payStatusEqual(payStatusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (inputTicketCriteria.getStatus() != null && inputTicketCriteria.getStatus().isPresent()) {
            String statusString = inputTicketCriteria.getStatus().get();
            Integer statusInteger = 0;
            for (InputTicketStatusEnum inputTicketStatus : InputTicketStatusEnum.values()) {
                if (inputTicketStatus.getDescription().equals(statusString)) {
                    statusInteger = inputTicketStatus.getValue();
                    break;
                }
            }
            Specification<InputTicket> currentSpec = InputTicketSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.inputTicketRepository.findAll(combinedSpec, sort);
    }

    public List<InputTicketDTO> getAllFormat(InputTicketCriteria inputTicketCriteria) {
        List<InputTicketDTO> listFormat = new ArrayList<>();
        for (InputTicket inputTicket : getAll(inputTicketCriteria)) {
            List<InputTicketDetailDTO> inputTicketDetails = new ArrayList<>();
            for (InputTicketDetail inputTicketDetail : inputTicketDetailRepository
                    .findAllByInputTicketId(inputTicket.getId())) {
                inputTicketDetails.add(new InputTicketDetailDTO(
                        ingredientService.getOneFormatById(inputTicketDetail.getId().getIngredientId()),
                        inputTicketDetail.getPrice(), inputTicketDetail.getQuantity()));
            }

            listFormat.add(new InputTicketDTO(inputTicket.getId(), inputTicket.getTimeCreate(),
                    employeeService.getOneFormatById(inputTicket.getEmployeeId()),
                    supplierRepository.findOneById(inputTicket.getSupplierId()), inputTicket.getTotalPrice(),
                    inputTicket.getPayStatus(), inputTicket.getStatus(), inputTicketDetails));
        }

        return listFormat;
    }

    public InputTicket upsert(InputTicket InputTicket) {
        return this.inputTicketRepository.save(InputTicket);
    }
}