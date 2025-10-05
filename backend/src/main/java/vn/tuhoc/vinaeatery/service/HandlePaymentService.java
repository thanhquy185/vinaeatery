package vn.tuhoc.vinaeatery.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.CategoryTable;
import vn.tuhoc.vinaeatery.domain.HandlePayment;
import vn.tuhoc.vinaeatery.domain.HandlePayment_;
import vn.tuhoc.vinaeatery.domain.Order;
import vn.tuhoc.vinaeatery.domain.OrderDetail;
import vn.tuhoc.vinaeatery.domain.OrderDetailId;
import vn.tuhoc.vinaeatery.domain.OrderSheetDetail;
import vn.tuhoc.vinaeatery.domain.OrderSheetDetailId;
import vn.tuhoc.vinaeatery.domain.UseTable;
import vn.tuhoc.vinaeatery.domain.criteria.HandlePaymentCriteria;
import vn.tuhoc.vinaeatery.domain.dto.HandlePaymentDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderSheetDTO;
import vn.tuhoc.vinaeatery.domain.dto.UseTableDTO;
import vn.tuhoc.vinaeatery.domain.enumm.HandlePaymentStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.SurchargeTypeEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.repository.HandlePaymentRepository;
import vn.tuhoc.vinaeatery.service.specification.HandlePaymentSpecification;

@Service
@RequiredArgsConstructor
public class HandlePaymentService {
    // Properties
    private final PayMethodService payMethodService;
    private final UseTableService useTableService;
    private final EmployeeService employeeService;
    private final CustomerService customerService;
    private final CategoryTableService categoryTableService;
    private final OrderService orderService;
    private final OrderDetailService orderDetailService;
    private final OrderSheetService orderSheetService;
    private final TimeService timeService;
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

    public boolean handleByBankWallet(String orderId, Long payTotalPrice) {
        HandlePayment handlePaymentUpdated = this.getOne();
        if (handlePaymentUpdated != null) {
            handlePaymentUpdated.setPayTotalPrice(payTotalPrice);
            handlePaymentUpdated.setStatus(HandlePaymentStatusEnum.COMPLETED);

            // Truy những thông tin cần thiết để xử lý
            // - Sử dụng bàn ăn
            UseTableDTO useTable = this.useTableService.getOneFormatById(handlePaymentUpdated.getUseTableId());
            // - Phiếu gọi món
            List<OrderSheetDTO> orderSheets = orderSheetService.getAllFormatWithUseTable(useTable.getId(),
                    useTable.getTable().getId());
            // - Chi tiết phiếu gọi món (Đã phục vụ)
            List<OrderSheetDetail> orderSheetDetailsFormat = new ArrayList<>();
            orderSheets.forEach((orderSheet) -> {
                if (orderSheet.getStatus() == OrderSheetStatusEnum.SERVICED) {
                    orderSheet.getOrderSheetDetails().forEach((orderSheetDetail) -> {
                        Boolean isExists = false;
                        breakpoint: for (int i = 0; i < orderSheetDetailsFormat.size(); i++) {
                            if (orderSheetDetail.getFood().getId().equals(orderSheetDetailsFormat.get(i).getId()
                                    .getFoodId())) {
                                orderSheetDetailsFormat.get(i).setQuantity(
                                        orderSheetDetailsFormat.get(i).getQuantity()
                                                + orderSheetDetail.getQuantity());
                                isExists = true;
                                break breakpoint;
                            }
                        }

                        if (!isExists) {
                            OrderSheetDetail newOrderSheetDetail = new OrderSheetDetail();
                            newOrderSheetDetail.setId(
                                    new OrderSheetDetailId(orderSheet.getId(), orderSheetDetail.getFood().getId()));
                            newOrderSheetDetail.setPrice(orderSheetDetail.getPrice());
                            newOrderSheetDetail.setQuantity(orderSheetDetail.getQuantity());
                            orderSheetDetailsFormat.add(newOrderSheetDetail);
                        }
                    });
                }
            });
            // - Tổng tiền món ăn
            Long totalFoodPrice = 0L;
            for (OrderSheetDetail orderSheetDetail : orderSheetDetailsFormat) {
                totalFoodPrice += orderSheetDetail.getPrice() * orderSheetDetail.getQuantity();
            }
            // - Giảm giá khách hàng
            Double customerDiscount = 1.0 * totalFoodPrice
                    * (customerService.getOneFormatById(useTable.getCustomer().getId()).getCustomerCard()
                            .getDiscount())
                    / 100;
            // - Phụ thu loại bàn ăn
            CategoryTable categoryTable = this.categoryTableService
                    .getOneById(useTable.getTable().getCategoryTable().getId());
            Double surchargeCategoryTable = 0D;
            if (categoryTable.getSurchargeType() != null
                    && categoryTable.getSurchargeValue() != null) {
                surchargeCategoryTable = categoryTable.getSurchargeType()
                        .equals(SurchargeTypeEnum.PERCENT.getValue())
                                ? (1.0 * totalFoodPrice * categoryTable.getSurchargeValue() / 100)
                                : categoryTable.getSurchargeValue();
            }

            // Đơn món ăn (Đã xác nhận - Đã thanh toán)
            Order newOrder = new Order();
            // - Thông tin cơ bản
            newOrder.setTimeCreate(LocalDateTime.now());
            newOrder.setEmployeeId(handlePaymentUpdated.getEmployeeId());
            newOrder.setCustomerId(useTable.getCustomer().getId());
            newOrder.setTotalPrice(Math.round(totalFoodPrice + (-1 * customerDiscount) + surchargeCategoryTable));
            newOrder.setStatus(OrderStatusEnum.CONFIRM);
            // - Thông tin thanh toán
            newOrder.setPayId(orderId);
            newOrder.setPayTime(LocalDateTime.now());
            newOrder.setPayMethodId(handlePaymentUpdated.getPayMethodId());
            newOrder.setPayTotalPrice(payTotalPrice);
            newOrder.setPayStatus(PayStatusEnum.PAY);
            Order newOrderAfterHandle = this.orderService.upsert(newOrder);

            // Chi tiết đơn hàng
            if (newOrderAfterHandle != null) {
                orderSheetDetailsFormat.forEach((orderSheetDetailFormat) -> {
                    OrderDetailId orderDetailId = new OrderDetailId(newOrderAfterHandle.getId(),
                            orderSheetDetailFormat.getId().getFoodId());
                    Long price = orderSheetDetailFormat.getPrice();
                    Long quantity = orderSheetDetailFormat.getQuantity();
                    this.orderDetailService.upsert(new OrderDetail(orderDetailId, price, quantity));
                });
            }

            // Sử dụng bàn ăn
            UseTable useTableUpdated = this.useTableService.getOneById(useTable.getId());
            if (useTableUpdated != null) {
                useTableUpdated.setTimeEnd(LocalDateTime.now());
                useTableUpdated.setEmployeeId(handlePaymentUpdated.getEmployeeId());
                useTableUpdated.setOrderId(newOrderAfterHandle.getId());

                UseTable newUseTable = new UseTable();
                newUseTable.setTimeStart(LocalDateTime.now());
                // newUseTable.setTimeEnd(null);
                newUseTable.setTableId(useTableUpdated.getTableId());
                // newUseTable.setEmployeeId(null);
                // newUseTable.setOrderId(null);
                newUseTable.setStatus(UseTableStatusEnum.EMPTY);

                this.useTableService.upsert(useTableUpdated);
                this.useTableService.upsert(newUseTable);
            }

            this.upsert(handlePaymentUpdated);
        }

        return true;
    }
}
