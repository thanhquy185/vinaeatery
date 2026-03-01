package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.dto.HandlePaymentUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderSheetDTO;
import vn.tuhoc.vinaeatery.domain.dto.UseTableDTO;
import vn.tuhoc.vinaeatery.domain.entity.CategoryTable;
import vn.tuhoc.vinaeatery.domain.entity.Employee;
import vn.tuhoc.vinaeatery.domain.entity.HandlePayment;
import vn.tuhoc.vinaeatery.domain.entity.Order;
import vn.tuhoc.vinaeatery.domain.entity.OrderDetail;
import vn.tuhoc.vinaeatery.domain.entity.OrderDetailId;
import vn.tuhoc.vinaeatery.domain.entity.OrderSheet;
import vn.tuhoc.vinaeatery.domain.entity.OrderSheetDetail;
import vn.tuhoc.vinaeatery.domain.entity.OrderSheetDetailId;
import vn.tuhoc.vinaeatery.domain.entity.UseTable;
import vn.tuhoc.vinaeatery.domain.enumm.HandlePaymentStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.CategoryTableSurchargeTypeEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.HandlePaymentDTO;
import vn.tuhoc.vinaeatery.service.CategoryTableService;
import vn.tuhoc.vinaeatery.service.CustomerService;
import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.HandlePaymentService;
import vn.tuhoc.vinaeatery.service.OrderDetailService;
import vn.tuhoc.vinaeatery.service.OrderService;
import vn.tuhoc.vinaeatery.service.OrderSheetService;
import vn.tuhoc.vinaeatery.service.PayMethodService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UseTableService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.SecurityUtil;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/handle-payments")
@RequiredArgsConstructor
public class HandlePaymentApiController {
    // Properties
    private final HandlePaymentService handlePaymentService;
    private final PayMethodService payMethodService;
    private final UseTableService useTableService;
    private final EmployeeService employeeService;
    private final CustomerService customerService;
    private final CategoryTableService categoryTableService;
    private final OrderService orderService;
    private final OrderDetailService orderDetailService;
    private final OrderSheetService orderSheetService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/get")
    public ResponseEntity<?> getHandlePayment(@RequestBody FormSecurityDTO formSecurityDTO) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "handle-payments", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        HandlePayment handlePaymentSelected = this.handlePaymentService.getOne();
        return ResponseEntity.status(HttpStatus.OK).body(handlePaymentSelected);
    }

    @PostMapping("/get-format-is-employee-handle")
    public ResponseEntity<?> getHandlePaymentFormatIsEmployeeHandle(
            @RequestBody FormSecurityDTO formSecurityDTO) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "handle-payments", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        HandlePaymentDTO handlePaymentSelected = this.handlePaymentService.getOneFormatByIsEmployeeHandle(true);
        return ResponseEntity.status(HttpStatus.OK).body(handlePaymentSelected);
    }

    @PostMapping("/get-format/{use-table-id}")
    public ResponseEntity<?> getHandlePaymentFormatByUseTableId(@PathVariable("use-table-id") Long useTableId,
            @RequestBody FormSecurityDTO formSecurityDTO) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "handle-payments", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        HandlePaymentDTO handlePaymentSelected = this.handlePaymentService.getOneFormatByUseTableId(useTableId);
        return ResponseEntity.status(HttpStatus.OK).body(handlePaymentSelected);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateHandlePayment(@PathVariable("id") Integer id,
            @RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("handle-payment") @Valid HandlePaymentUpdateDTO handlePayment,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "handle-payments", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        HandlePayment handlePaymentUpdated = this.handlePaymentService.getOneById(id);
        if (handlePaymentUpdated != null) {
            handlePaymentUpdated.setUseTableId(handlePayment.getUseTableId());
            if (handlePayment.getEmployeeId() != null
                    || handlePayment.getStatus() == HandlePaymentStatusEnum.NOTHING) {
                handlePaymentUpdated.setEmployeeId(handlePayment.getEmployeeId());
            }
            handlePaymentUpdated.setPayMethodId(handlePayment.getPayMethodId());
            handlePaymentUpdated.setIsEmployeeHandle(handlePayment.getIsEmployeeHandle());
            handlePaymentUpdated.setPayTotalPrice(handlePayment.getPayTotalPrice());
            handlePaymentUpdated.setStatus(handlePayment.getStatus());

            if (handlePayment.getStatus() == HandlePaymentStatusEnum.COMPLETED) {
                // Truy những thông tin cần thiết để xử lý
                // - Sử dụng bàn ăn
                UseTableDTO useTable = this.useTableService.getOneFormatById(handlePayment.getUseTableId());
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
                // - Phụ thu loại bàn ăn
                CategoryTable categoryTable = this.categoryTableService
                        .getOneById(useTable.getTable().getCategoryTable().getId());
                Double surchargeCategoryTable = 0D;
                if (categoryTable.getSurchargeType() != null
                        && categoryTable.getSurchargeValue() != null) {
                    surchargeCategoryTable = categoryTable.getSurchargeType()
                            .equals(CategoryTableSurchargeTypeEnum.PERCENT.getValue())
                                    ? (1.0 * totalFoodPrice * categoryTable.getSurchargeValue() / 100)
                                    : categoryTable.getSurchargeValue();
                }

                // Đơn món ăn (Đã xác nhận - Đã thanh toán)
                Order newOrder = new Order();
                // - Thông tin cơ bản
                newOrder.setCreateAt(LocalDateTime.now());
                newOrder.setRestaurantId(
                        this.useTableService.getOneById(handlePayment.getUseTableId()).getRestaurantId());
                newOrder.setEmployeeId(handlePayment.getEmployeeId());
                newOrder.setCustomerId(useTable.getCustomer().getId());
                newOrder.setCustomerFullname(useTable.getCustomerFullname());
                newOrder.setCustomerPhone(useTable.getCustomerPhone());
                newOrder.setCustomerEmail(useTable.getCustomerEmail());
                newOrder.setTotalPrice(Math.round(totalFoodPrice + surchargeCategoryTable));
                newOrder.setStatus(OrderStatusEnum.CONFIRM);
                // - Thông tin thanh toán
                newOrder.setPayTime(LocalDateTime.now());
                newOrder.setPayMethodId(handlePayment.getPayMethodId());
                newOrder.setPayTotalPrice(handlePayment.getPayTotalPrice());
                newOrder.setPayStatus(PayStatusEnum.PAY);
                if (handlePayment.getPayMethodId() == 1) {
                    newOrder.setPayId("thanh-toan-bang-tien-mat-" + System.currentTimeMillis());
                } else if (handlePayment.getPayMethodId() == 2) {
                    newOrder.setPayId("thanh-toan-bang-ngan-hang-" + System.currentTimeMillis());
                } else if (handlePayment.getPayMethodId() == 3) {

                }
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
                    useTableUpdated.setEmployeeId(handlePayment.getEmployeeId());
                    useTableUpdated.setOrderId(newOrderAfterHandle.getId());

                    UseTable newUseTable = new UseTable();
                    newUseTable.setTimeStart(LocalDateTime.now());
                    // newUseTable.setTimeEnd(null);
                    newUseTable.setRestaurantId(useTableUpdated.getRestaurantId());
                    newUseTable.setTableId(useTableUpdated.getTableId());
                    // newUseTable.setEmployeeId(null);
                    // newUseTable.setOrderId(null);
                    newUseTable.setStatus(UseTableStatusEnum.EMPTY);

                    this.useTableService.upsert(useTableUpdated);
                    this.useTableService.upsert(newUseTable);
                }
            }

            this.handlePaymentService.upsert(handlePaymentUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(handlePaymentUpdated);
    }
}
