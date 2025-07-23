package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Order;
import vn.tuhoc.vinaeatery.domain.OrderDetail;
import vn.tuhoc.vinaeatery.domain.Order_;
import vn.tuhoc.vinaeatery.domain.criteria.OrderCriteria;
import vn.tuhoc.vinaeatery.domain.dto.OrderDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderDetailDTO;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.repository.OrderDetailRepository;
import vn.tuhoc.vinaeatery.repository.OrderRepository;
import vn.tuhoc.vinaeatery.service.specification.OrderSpecification;

@Service
@AllArgsConstructor
public class OrderService {
    // Properties
    private final FoodService foodService;
    private final TableService tableService;
    private final CustomerService customerService;
    private final EmployeeService employeeService;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    // Methods
    public Order getOneById(Integer id) {
        return this.orderRepository.findOneById(id);
    }

    public List<Order> getAll() {
        return this.orderRepository.findAll();
    }

    public List<Order> getAll(OrderCriteria orderCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (orderCriteria.getSort() != null && orderCriteria.getSort().isPresent()) {
            String sortStr = orderCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(Order_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(Order_.ID).descending();
                case "Thời gian tạo phiếu tăng dần" -> sort = Sort.by(Order_.TIME_CREATE).ascending();
                case "Thời gian tạo phiếu giảm dần" -> sort = Sort.by(Order_.TIME_CREATE).descending();
                case "Tổng thanh toán tăng dần" -> sort = Sort.by(Order_.TOTAL_PRICE).ascending();
                case "Tổng thanh toán giảm dần" -> sort = Sort.by(Order_.TOTAL_PRICE).descending();
            }
        }

        //
        if (orderCriteria.getId() == null && orderCriteria.getTimeCreateStart() == null
                && orderCriteria.getTimeCreateEnd() == null
                && orderCriteria.getEmployeeId() == null
                && orderCriteria.getTableId() == null
                && orderCriteria.getCustomerId() == null
                && orderCriteria.getStatusMerge() == null
                && orderCriteria.getPayStatus() == null
                && orderCriteria.getStatus() == null
                && orderCriteria.getSort() == null) {
            return this.orderRepository.findAll();
        }

        //
        Specification<Order> combinedSpec = Specification.where(null);
        if (orderCriteria.getId() != null && orderCriteria.getId().isPresent()) {
            if (orderCriteria.getId().get().matches("\\d+")) {
                Specification<Order> currentSpec = OrderSpecification
                        .idEqual(orderCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderCriteria.getTimeCreateStart() != null && orderCriteria.getTimeCreateStart().isPresent()) {
            Specification<Order> currentSpec = OrderSpecification
                    .timeCreateAfter(orderCriteria.getTimeCreateStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderCriteria.getTimeCreateEnd() != null && orderCriteria.getTimeCreateEnd().isPresent()) {
            Specification<Order> currentSpec = OrderSpecification
                    .timeCreateBefore(orderCriteria.getTimeCreateEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderCriteria.getEmployeeId() != null && orderCriteria.getEmployeeId().isPresent()) {
            if (orderCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<Order> currentSpec = OrderSpecification
                        .employeeIdEqual(orderCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderCriteria.getTableId() != null && orderCriteria.getTableId().isPresent()) {
            if (orderCriteria.getTableId().get().matches("\\d+")) {
                Specification<Order> currentSpec = OrderSpecification
                        .tableIdEqual(orderCriteria.getTableId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderCriteria.getCustomerId() != null && orderCriteria.getCustomerId().isPresent()) {
            if (orderCriteria.getCustomerId().get().matches("\\d+")) {
                Specification<Order> currentSpec = OrderSpecification
                        .customerIdEqual(orderCriteria.getCustomerId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderCriteria.getStatusMerge() != null && orderCriteria.getStatusMerge().isPresent()) {
            String[] statusMergeArray = orderCriteria.getStatusMerge().get().split(",");
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
                for (OrderStatusEnum orderStatus : OrderStatusEnum.values()) {
                    if (orderStatus.getDescription().equals(statusMerge)) {
                        statusInteger = orderStatus.getValue();
                        break;
                    }
                }

                Specification<Order> currentSpec = payStatusBoolean != null && statusInteger == null
                        ? OrderSpecification.payStatusEqual(payStatusBoolean)
                        : OrderSpecification.statusEqual(statusInteger);
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderCriteria.getPayStatus() != null && orderCriteria.getPayStatus().isPresent()) {
            String payStatusString = orderCriteria.getPayStatus().get();
            Boolean payStatusBoolean = false;
            for (PayStatusEnum payStatus : PayStatusEnum.values()) {
                if (payStatus.getDescription().equals(payStatusString)) {
                    payStatusBoolean = payStatus.getValue();
                    break;
                }
            }
            Specification<Order> currentSpec = OrderSpecification.payStatusEqual(payStatusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderCriteria.getStatus() != null && orderCriteria.getStatus().isPresent()) {
            String statusString = orderCriteria.getStatus().get();
            Integer statusInteger = 0;
            for (OrderStatusEnum OrderStatus : OrderStatusEnum.values()) {
                if (OrderStatus.getDescription().equals(statusString)) {
                    statusInteger = OrderStatus.getValue();
                    break;
                }
            }
            Specification<Order> currentSpec = OrderSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.orderRepository.findAll(combinedSpec, sort);
    }

    public List<OrderDTO> getAllFormat(OrderCriteria orderCriteria) {
        List<OrderDTO> listFormat = new ArrayList<>();
        for (Order order : getAll(orderCriteria)) {
            List<OrderDetailDTO> orderDetails = new ArrayList<>();
            for (OrderDetail orderDetail : orderDetailRepository
                    .findAllByOrderId(order.getId())) {
                orderDetails.add(new OrderDetailDTO(
                        foodService.getOneFormatById(orderDetail.getId().getFoodId()),
                        orderDetail.getPrice(), orderDetail.getQuantity()));
            }

            listFormat.add(new OrderDTO(order.getId(), order.getTimeCreate(),
                    employeeService.getOneFormatById(order.getEmployeeId()),
                    tableService.getOneFormatById(order.getTableId()),
                    customerService.getOneFormatById(order.getCustomerId()),
                    order.getTotalPrice(), order.getPayStatus(), order.getStatus(),
                    orderDetails));
        }

        return listFormat;
    }

    public Order upsert(Order order) {
        return this.orderRepository.save(order);
    }
}