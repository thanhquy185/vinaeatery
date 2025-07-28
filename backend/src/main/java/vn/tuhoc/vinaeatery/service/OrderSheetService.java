package vn.tuhoc.vinaeatery.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.datetime.DateFormatter;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.OrderSheet;
import vn.tuhoc.vinaeatery.domain.OrderSheetDetail;
import vn.tuhoc.vinaeatery.domain.OrderSheet_;
import vn.tuhoc.vinaeatery.domain.criteria.OrderSheetCriteria;
import vn.tuhoc.vinaeatery.domain.dto.OrderSheetDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderSheetDetailDTO;
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.repository.OrderSheetDetailRepository;
import vn.tuhoc.vinaeatery.repository.OrderSheetRepository;
import vn.tuhoc.vinaeatery.service.specification.OrderSheetSpecification;

@Service
@AllArgsConstructor
public class OrderSheetService {
    // Properties
    private final TableService tableService;
    private final FoodService foodService;
    private final EmployeeService employeeService;
    private final OrderSheetRepository orderSheetRepository;
    private final OrderSheetDetailRepository orderSheetDetailRepository;
    private final TimeService timeService;

    // Methods
    public OrderSheet getOneById(Integer id) {
        return this.orderSheetRepository.findOneById(id);
    }

    public OrderSheetDTO getOneFormatById(Integer id) {
        OrderSheetDTO orderSheetDTO = new OrderSheetDTO();
        OrderSheet orderSheet = this.orderSheetRepository.findOneById(id);
        if (orderSheet != null) {
            List<OrderSheetDetailDTO> orderSheetDetails = new ArrayList<>();
            for (OrderSheetDetail orderSheetDetail : orderSheetDetailRepository
                    .findAllByOrderSheetId(orderSheet.getId())) {
                orderSheetDetails.add(new OrderSheetDetailDTO(
                        foodService.getOneFormatById(orderSheetDetail.getId().getFoodId()),
                        orderSheetDetail.getPrice(), orderSheetDetail.getQuantity()));
            }

            orderSheetDTO.setId(orderSheet.getId());
            orderSheetDTO.setTimeCreate(orderSheet.getTimeCreate());
            orderSheetDTO.setTimeService(orderSheet.getTimeService());
            if (orderSheet.getEmployeeId() != null) {
                orderSheetDTO.setEmployee(employeeService.getOneFormatById(orderSheet.getEmployeeId()));
            }
            if (orderSheet.getTableId() != null) {
                orderSheetDTO.setTable(tableService.getOneFormatById(orderSheet.getTableId()));
            }
            orderSheetDTO.setTotalPrice(orderSheet.getTotalPrice());
            orderSheetDTO.setNote(orderSheet.getNote());
            orderSheetDTO.setMessage(orderSheet.getMessage());
            orderSheetDTO.setStatus(orderSheet.getStatus());
            orderSheetDTO.setOrderSheetDetails(orderSheetDetails);
        }

        return orderSheetDTO;
    }

    public List<OrderSheet> getAll() {
        return this.orderSheetRepository.findAll();
    }

    public List<OrderSheet> getAllWithUseTable(Long useTableId, Integer tableId) {
        return this.orderSheetRepository.findAllWithUseTable(useTableId, tableId);
    }

    public List<OrderSheetDTO> getAllFormatWithUseTable(Long useTableId, Integer tableId) {
        List<OrderSheetDTO> orderSheetDTOs = new ArrayList<>();
        List<OrderSheet> orderSheets = this.orderSheetRepository.findAllWithUseTable(useTableId, tableId);
        if (orderSheets != null && !orderSheets.isEmpty()) {
            for (OrderSheet orderSheet : orderSheets) {
                List<OrderSheetDetailDTO> orderSheetDetails = new ArrayList<>();
                for (OrderSheetDetail orderSheetDetail : orderSheetDetailRepository
                        .findAllByOrderSheetId(orderSheet.getId())) {
                    orderSheetDetails.add(new OrderSheetDetailDTO(
                            foodService.getOneFormatById(orderSheetDetail.getId().getFoodId()),
                            orderSheetDetail.getPrice(), orderSheetDetail.getQuantity()));
                }

                OrderSheetDTO orderSheetDTO = new OrderSheetDTO();
                orderSheetDTO.setId(orderSheet.getId());
                orderSheetDTO.setTimeCreate(orderSheet.getTimeCreate());
                orderSheetDTO.setTimeService(orderSheet.getTimeService());
                if (orderSheet.getEmployeeId() != null) {
                    orderSheetDTO.setEmployee(employeeService.getOneFormatById(orderSheet.getEmployeeId()));
                }
                if (orderSheet.getTableId() != null) {
                    orderSheetDTO.setTable(tableService.getOneFormatById(orderSheet.getTableId()));
                }
                orderSheetDTO.setTotalPrice(orderSheet.getTotalPrice());
                orderSheetDTO.setNote(orderSheet.getNote());
                orderSheetDTO.setMessage(orderSheet.getMessage());
                orderSheetDTO.setStatus(orderSheet.getStatus());
                orderSheetDTO.setOrderSheetDetails(orderSheetDetails);

                orderSheetDTOs.add(orderSheetDTO);
            }
        }

        return orderSheetDTOs;
    }

    public List<OrderSheet> getAll(OrderSheetCriteria orderSheetCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (orderSheetCriteria.getSort() != null && orderSheetCriteria.getSort().isPresent()) {
            String sortStr = orderSheetCriteria.getSort().get();
            switch (sortStr) {
                case "ID tăng dần" -> sort = Sort.by(OrderSheet_.ID).ascending();
                case "ID giảm dần" -> sort = Sort.by(OrderSheet_.ID).descending();
                case "Thời gian tạo phiếu tăng dần" -> sort = Sort.by(OrderSheet_.TIME_CREATE).ascending();
                case "Thời gian tạo phiếu giảm dần" -> sort = Sort.by(OrderSheet_.TIME_CREATE).descending();
                case "Tổng thanh toán tăng dần" -> sort = Sort.by(OrderSheet_.TOTAL_PRICE).ascending();
                case "Tổng thanh toán giảm dần" -> sort = Sort.by(OrderSheet_.TOTAL_PRICE).descending();
            }
        }

        //
        if (orderSheetCriteria.getId() == null && orderSheetCriteria.getTimeCreateStart() == null
                && orderSheetCriteria.getTimeCreateEnd() == null
                && orderSheetCriteria.getTimeServiceStart() == null
                && orderSheetCriteria.getTimeServiceEnd() == null
                && orderSheetCriteria.getCurrentDate() == null
                && orderSheetCriteria.getEmployeeId() == null
                && orderSheetCriteria.getTableId() == null
                && orderSheetCriteria.getFloorId() == null
                && orderSheetCriteria.getStatus() == null
                && orderSheetCriteria.getSort() == null) {
            return this.orderSheetRepository.findAll();
        }

        //
        Specification<OrderSheet> combinedSpec = Specification.where(null);
        if (orderSheetCriteria.getId() != null && orderSheetCriteria.getId().isPresent()) {
            if (orderSheetCriteria.getId().get().matches("\\d+")) {
                Specification<OrderSheet> currentSpec = OrderSheetSpecification
                        .idEqual(orderSheetCriteria.getId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderSheetCriteria.getTimeCreateStart() != null && orderSheetCriteria.getTimeCreateStart().isPresent()) {
            Specification<OrderSheet> currentSpec = OrderSheetSpecification
                    .timeCreateAfter(orderSheetCriteria.getTimeCreateStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderSheetCriteria.getTimeCreateEnd() != null && orderSheetCriteria.getTimeCreateEnd().isPresent()) {
            Specification<OrderSheet> currentSpec = OrderSheetSpecification
                    .timeCreateBefore(orderSheetCriteria.getTimeCreateEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderSheetCriteria.getTimeServiceStart() != null && orderSheetCriteria.getTimeServiceStart().isPresent()) {
            Specification<OrderSheet> currentSpec = OrderSheetSpecification
                    .timeServiceAfter(orderSheetCriteria.getTimeServiceStart().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderSheetCriteria.getTimeServiceEnd() != null && orderSheetCriteria.getTimeServiceEnd().isPresent()) {
            Specification<OrderSheet> currentSpec = OrderSheetSpecification
                    .timeServiceBefore(orderSheetCriteria.getTimeServiceEnd().get());
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderSheetCriteria.getCurrentDate() != null && orderSheetCriteria.getCurrentDate().isPresent()) {
            sort = Sort.by(OrderSheet_.ID).descending();
            Specification<OrderSheet> currentSpec = OrderSheetSpecification.currentDate();
            combinedSpec = combinedSpec.and(currentSpec);
        }
        if (orderSheetCriteria.getEmployeeId() != null && orderSheetCriteria.getEmployeeId().isPresent()) {
            if (orderSheetCriteria.getEmployeeId().get().matches("\\d+")) {
                Specification<OrderSheet> currentSpec = OrderSheetSpecification
                        .employeeIdEqual(orderSheetCriteria.getEmployeeId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderSheetCriteria.getTableId() != null && orderSheetCriteria.getTableId().isPresent()) {
            if (orderSheetCriteria.getTableId().get().matches("\\d+")) {
                Specification<OrderSheet> currentSpec = OrderSheetSpecification
                        .tableIdEqual(orderSheetCriteria.getTableId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderSheetCriteria.getFloorId() != null && orderSheetCriteria.getFloorId().isPresent()) {
            if (orderSheetCriteria.getFloorId().get().matches("\\d+")) {
                Specification<OrderSheet> currentSpec = OrderSheetSpecification
                        .floorIdEqual(orderSheetCriteria.getFloorId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (orderSheetCriteria.getStatus() != null && orderSheetCriteria.getStatus().isPresent()) {
            String statusString = orderSheetCriteria.getStatus().get();
            Integer statusInteger = 0;
            for (OrderSheetStatusEnum orderSheetStatus : OrderSheetStatusEnum.values()) {
                if (orderSheetStatus.getDescription().equals(statusString)) {
                    statusInteger = orderSheetStatus.getValue();
                    break;
                }
            }
            Specification<OrderSheet> currentSpec = OrderSheetSpecification.statusEqual(statusInteger);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.orderSheetRepository.findAll(combinedSpec, sort);
    }

    public List<OrderSheetDTO> getAllFormat(OrderSheetCriteria orderSheetCriteria) {
        List<OrderSheetDTO> listFormat = new ArrayList<>();
        for (OrderSheet orderSheet : getAll(orderSheetCriteria)) {
            List<OrderSheetDetailDTO> orderSheetDetails = new ArrayList<>();
            for (OrderSheetDetail orderSheetDetail : orderSheetDetailRepository
                    .findAllByOrderSheetId(orderSheet.getId())) {
                orderSheetDetails.add(new OrderSheetDetailDTO(
                        foodService.getOneFormatById(orderSheetDetail.getId().getFoodId()),
                        orderSheetDetail.getPrice(), orderSheetDetail.getQuantity()));
            }

            OrderSheetDTO orderSheetDTO = new OrderSheetDTO();
            orderSheetDTO.setId(orderSheet.getId());
            orderSheetDTO.setTimeCreate(orderSheet.getTimeCreate());
            orderSheetDTO.setTimeService(orderSheet.getTimeService());
            if (orderSheet.getEmployeeId() != null) {
                orderSheetDTO.setEmployee(employeeService.getOneFormatById(orderSheet.getEmployeeId()));
            }
            if (orderSheet.getTableId() != null) {
                orderSheetDTO.setTable(tableService.getOneFormatById(orderSheet.getTableId()));
            }
            orderSheetDTO.setTotalPrice(orderSheet.getTotalPrice());
            orderSheetDTO.setNote(orderSheet.getNote());
            orderSheetDTO.setMessage(orderSheet.getMessage());
            orderSheetDTO.setStatus(orderSheet.getStatus());
            orderSheetDTO.setOrderSheetDetails(orderSheetDetails);

            listFormat.add(orderSheetDTO);
        }

        return listFormat;
    }

    public OrderSheet upsert(OrderSheet orderSheet) {
        return this.orderSheetRepository.save(orderSheet);
    }
}