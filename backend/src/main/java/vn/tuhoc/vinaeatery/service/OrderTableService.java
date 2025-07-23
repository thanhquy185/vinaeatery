package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.OrderTable_;
import vn.tuhoc.vinaeatery.domain.InputTicket;
import vn.tuhoc.vinaeatery.domain.OrderTable;
import vn.tuhoc.vinaeatery.domain.criteria.OrderTableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderTableDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.OrderTableRepository;
import vn.tuhoc.vinaeatery.service.specification.InputTicketSpecification;
import vn.tuhoc.vinaeatery.service.specification.OrderTableSpecification;

@Service
@AllArgsConstructor
public class OrderTableService {
    // Properties
    private final EmployeeService employeeService;
    private final OrderTableRepository orderTableRepository;

    // Methods
    public OrderTable getOneById(Integer id) {
        return this.orderTableRepository.findOneById(id);
    }

    public List<OrderTable> getAll() {
        return this.orderTableRepository.findAll();
    }

    public List<OrderTable> getAll(OrderTableCriteria orderTableCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (orderTableCriteria.getSort() != null && orderTableCriteria.getSort().isPresent()) {
            String sortStr = orderTableCriteria.getSort().get();
            switch (sortStr) {
                case "Mã đơn đặt bàn tăng dần" -> sort = Sort.by(OrderTable_.ID).ascending();
                case "Mã đơn đặt bàn giảm dần" -> sort = Sort.by(OrderTable_.ID).descending();
                case "Thời gian đặt bàn tăng dần" -> sort = Sort.by(OrderTable_.TIME_ORDER).ascending();
                case "Thời gian đặt bàn giảm dần" -> sort = Sort.by(OrderTable_.TIME_ORDER).descending();
                case "Thời gian đến ăn tăng dần" -> sort = Sort.by(OrderTable_.TIME_ARRIVE).ascending();
                case "Thời gian đến ăn giảm dần" -> sort = Sort.by(OrderTable_.TIME_ARRIVE).descending();
                case "Tên người đặt tăng dần" -> sort = Sort.by(OrderTable_.FULLNAME).ascending();
                case "Tên người đặt giảm dần" -> sort = Sort.by(OrderTable_.FULLNAME).descending();
            }
        }

        //
        if (orderTableCriteria.getId() == null && orderTableCriteria.getTimeOrderStart() == null
                && orderTableCriteria.getTimeOrderEnd() == null && orderTableCriteria.getFullname() == null
                && orderTableCriteria.getPhone() == null && orderTableCriteria.getEmail() == null
                && orderTableCriteria.getStatus() == null && orderTableCriteria.getSort() == null) {
            return this.orderTableRepository.findAll(sort);
        }
        //
        Specification<OrderTable> combinedSpec = Specification.where(null);
        if (orderTableCriteria.getId() != null && orderTableCriteria.getId().isPresent()) {
            if (orderTableCriteria.getId().get().matches("\\d+")) {
                Specification<OrderTable> currentSpec = OrderTableSpecification
                        .idEqual(orderTableCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (orderTableCriteria.getTimeOrderStart() != null && orderTableCriteria.getTimeOrderStart().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .timeOrderAfter(orderTableCriteria.getTimeOrderStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderTableCriteria.getTimeOrderEnd() != null && orderTableCriteria.getTimeOrderEnd().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .timeOrderBefore(orderTableCriteria.getTimeOrderEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderTableCriteria.getTimeArriveStart() != null && orderTableCriteria.getTimeArriveStart().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .timeArriveAfter(orderTableCriteria.getTimeArriveStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderTableCriteria.getTimeArriveEnd() != null && orderTableCriteria.getTimeArriveEnd().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .timeArriveBefore(orderTableCriteria.getTimeArriveEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderTableCriteria.getFullname() != null && orderTableCriteria.getFullname().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .fullnameLike(orderTableCriteria.getFullname().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (orderTableCriteria.getPhone() != null && orderTableCriteria.getPhone().isPresent()) {
            if (orderTableCriteria.getPhone().get().matches("\\d+")) {
                Specification<OrderTable> currentSpec = OrderTableSpecification
                        .phoneLike(orderTableCriteria.getPhone().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (orderTableCriteria.getEmail() != null && orderTableCriteria.getEmail().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .emailLike(orderTableCriteria.getEmail().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (orderTableCriteria.getStatus() != null && orderTableCriteria.getStatus().isPresent()) {
            String statusString = orderTableCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<OrderTable> currentSpec = OrderTableSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.orderTableRepository.findAll(combinedSpec, sort);
    }

    public List<OrderTableDTO> getAllFormat(OrderTableCriteria orderTableCriteria) {
        List<OrderTableDTO> listFormat = new ArrayList<>();
        for (OrderTable orderTable : getAll(orderTableCriteria)) {
            EmployeeDTO employee = employeeService.getOneFormatById(orderTable.getEmployeeId());

            OrderTableDTO newOrderTable = new OrderTableDTO(orderTable.getId(), employee, orderTable.getTimeOrder(),
                    orderTable.getTimeArrive(), orderTable.getNote(), orderTable.getFullname(), orderTable.getPhone(),
                    orderTable.getEmail(), orderTable.getAddress(), orderTable.getStatus(), orderTable.getTimeUpdate());
            listFormat.add(newOrderTable);
        }

        return listFormat;
    }

    public OrderTable upsert(OrderTable OrderTable) {
        return this.orderTableRepository.save(OrderTable);
    }

    public void delete(Integer id) {
        this.orderTableRepository.deleteById(id);
    }

    public void lock(OrderTable OrderTable) {
        this.orderTableRepository.save(OrderTable);
    }
}