package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.OrderTableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.OrderTableDTO;
import vn.tuhoc.vinaeatery.domain.entity.OrderTable;
import vn.tuhoc.vinaeatery.domain.entity.OrderTable_;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
import vn.tuhoc.vinaeatery.repository.OrderTableRepository;
import vn.tuhoc.vinaeatery.service.specification.OrderTableSpecification;

@Service
@RequiredArgsConstructor
public class OrderTableService {
    // Properties
    private final RestaurantService restaurantService;
    private final EmployeeService employeeService;
    private final CustomerService customerService;
    private final OrderTableRepository orderTableRepository;

    // Methods
    public OrderTable getOneById(Integer id) {
        return this.orderTableRepository.findOneById(id);
    }

    public OrderTableDTO getOneFormatById(Integer id) {
        OrderTableDTO orderTableDTO = new OrderTableDTO();
        OrderTable orderTable = this.orderTableRepository.findOneById(id);
        if (orderTable != null) {
            orderTableDTO.setId(orderTable.getId());
            orderTableDTO.setRestaurantId(orderTable.getRestaurantId());
            orderTableDTO.setRestaurant(restaurantService.getOneFormatById(orderTable.getRestaurantId()));
            if (orderTable.getEmployeeId() != null) {
                orderTableDTO.setEmployee(employeeService.getOneFormatById(orderTable.getEmployeeId()));
            }
            orderTableDTO.setCustomer(customerService.getOneFormatById(orderTable.getCustomerId()));
            orderTableDTO.setCreateAt(orderTable.getCreateAt());
            orderTableDTO.setArriveAt(orderTable.getArriveAt());
            orderTableDTO.setCustomerFullname(orderTable.getCustomerFullname());
            orderTableDTO.setCustomerPhone(orderTable.getCustomerPhone());
            orderTableDTO.setCustomerEmail(orderTable.getCustomerEmail());
            orderTableDTO.setCustomerNote(orderTable.getCustomerNote());
            orderTableDTO.setGuests(orderTable.getGuests());
            orderTableDTO.setStatus(orderTable.getStatus());
        }

        return orderTableDTO;
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
                case "Thời gian đặt bàn tăng dần" -> sort = Sort.by(OrderTable_.CREATE_AT).ascending();
                case "Thời gian đặt bàn giảm dần" -> sort = Sort.by(OrderTable_.CREATE_AT).descending();
                case "Thời gian dự kiến tăng dần" -> sort = Sort.by(OrderTable_.ARRIVE_AT).ascending();
                case "Thời gian dự kiến giảm dần" -> sort = Sort.by(OrderTable_.ARRIVE_AT).descending();
            }
        }

        //
        if (orderTableCriteria.getId() == null
                && orderTableCriteria.getRestaurantId() == null
                && orderTableCriteria.getEmployeeId() == null
                && orderTableCriteria.getCustomerId() == null
                && orderTableCriteria.getCreateAtStart() == null
                && orderTableCriteria.getCreateAtEnd() == null
                && orderTableCriteria.getArriveAtStart() == null
                && orderTableCriteria.getArriveAtEnd() == null
                && orderTableCriteria.getCustomerFullname() == null
                && orderTableCriteria.getCustomerPhone() == null
                && orderTableCriteria.getCustomerEmail() == null
                && orderTableCriteria.getStatus() == null
                && orderTableCriteria.getSort() == null) {
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
        if (orderTableCriteria.getRestaurantId() != null && orderTableCriteria.getRestaurantId().isPresent()) {
            if (orderTableCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<OrderTable> currentSpec = OrderTableSpecification
                        .restaurantIdEqual(orderTableCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderTableCriteria.getEmployeeId() != null && orderTableCriteria.getEmployeeId().isPresent()) {
            if (orderTableCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<OrderTable> currentSpec = OrderTableSpecification
                        .employeeIdEqual(orderTableCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderTableCriteria.getCustomerId() != null && orderTableCriteria.getCustomerId().isPresent()) {
            if (orderTableCriteria.getCustomerId().get().matches("\\d+")) {
                Specification<OrderTable> currentSpec = OrderTableSpecification
                        .customerIdEqual(orderTableCriteria.getCustomerId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderTableCriteria.getCreateAtStart() != null && orderTableCriteria.getCreateAtStart().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .createAtAfter(orderTableCriteria.getCreateAtStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderTableCriteria.getCreateAtEnd() != null && orderTableCriteria.getCreateAtEnd().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .createAtBefore(orderTableCriteria.getCreateAtEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderTableCriteria.getArriveAtStart() != null && orderTableCriteria.getArriveAtStart().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .arriveAtAfter(orderTableCriteria.getArriveAtStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderTableCriteria.getArriveAtEnd() != null && orderTableCriteria.getArriveAtEnd().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .arriveAtBefore(orderTableCriteria.getArriveAtEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderTableCriteria.getCustomerFullname() != null && orderTableCriteria.getCustomerFullname().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .customerFullnameLike(orderTableCriteria.getCustomerFullname().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (orderTableCriteria.getCustomerPhone() != null && orderTableCriteria.getCustomerPhone().isPresent()) {
            if (orderTableCriteria.getCustomerPhone().get().matches("\\d+")) {
                Specification<OrderTable> currentSpec = OrderTableSpecification
                        .customerPhoneLike(orderTableCriteria.getCustomerPhone().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (orderTableCriteria.getCustomerEmail() != null && orderTableCriteria.getCustomerEmail().isPresent()) {
            Specification<OrderTable> currentSpec = OrderTableSpecification
                    .customerEmailLike(orderTableCriteria.getCustomerEmail().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (orderTableCriteria.getStatus() != null && orderTableCriteria.getStatus().isPresent()) {
            String statusString = orderTableCriteria.getStatus().get();
            Integer statusInteger = 0;
            for (OrderStatusEnum orderStatus : OrderStatusEnum.values()) {
                if (orderStatus.getDescription().equals(statusString)) {
                    statusInteger = orderStatus.getValue();
                    break;
                }
            }
            Specification<OrderTable> currentSpec = OrderTableSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.orderTableRepository.findAll(combinedSpec, sort);
    }

    public List<OrderTableDTO> getAllFormat(OrderTableCriteria orderTableCriteria) {
        List<OrderTableDTO> listFormat = new ArrayList<>();
        for (OrderTable orderTable : getAll(orderTableCriteria)) {
            listFormat.add(getOneFormatById(orderTable.getId()));
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