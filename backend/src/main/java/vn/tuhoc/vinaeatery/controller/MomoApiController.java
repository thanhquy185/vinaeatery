package vn.tuhoc.vinaeatery.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.tuhoc.vinaeatery.domain.CategoryTable;
import vn.tuhoc.vinaeatery.domain.Employee;
import vn.tuhoc.vinaeatery.domain.HandlePayment;
import vn.tuhoc.vinaeatery.domain.Order;
import vn.tuhoc.vinaeatery.domain.OrderDetail;
import vn.tuhoc.vinaeatery.domain.OrderDetailId;
import vn.tuhoc.vinaeatery.domain.OrderSheetDetail;
import vn.tuhoc.vinaeatery.domain.OrderSheetDetailId;
import vn.tuhoc.vinaeatery.domain.UseTable;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderSheetDTO;
import vn.tuhoc.vinaeatery.domain.dto.UseTableDTO;
import vn.tuhoc.vinaeatery.domain.enumm.HandlePaymentStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.SurchargeTypeEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.service.CategoryTableService;
import vn.tuhoc.vinaeatery.service.CustomerService;
import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.HandlePaymentService;
import vn.tuhoc.vinaeatery.service.MomoService;
import vn.tuhoc.vinaeatery.service.OrderDetailService;
import vn.tuhoc.vinaeatery.service.OrderService;
import vn.tuhoc.vinaeatery.service.OrderSheetService;
import vn.tuhoc.vinaeatery.service.PayMethodService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UseTableService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.SecurityUtil;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/momo")
@RequiredArgsConstructor
@Slf4j
public class MomoApiController {
    // Properties
    private final MomoService momoService;
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
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createQR(@RequestPart("form-security") FormSecurityDTO formSecurityDTO) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "momo", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        return ResponseEntity.status(HttpStatus.OK).body(momoService.handleCreateMomoQR());
    }

    // IPN handler - MoMo gọi khi thanh toán xong
    @PostMapping("/ipn-handler")
    public ResponseEntity<?> ipnHandler(@RequestBody Map<String, String> params) {
        log.info("Received IPN: {}", params);

        String resultCode = params.get("resultCode");
        String orderId = params.get("orderId");
        Long payTotalPrice = Long.parseLong(params.get("amount"));

        if (!"0".equals(resultCode)) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thanh toán bằng ví MoMo thất bại !");
        }

        HandlePayment handlePaymentUpdated = this.handlePaymentService.getOneById(0);
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
            newOrder.setPayMethodId(4);
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

            this.handlePaymentService.upsert(handlePaymentUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body("Thanh toán bằng ví MoMo thành công !");
    }

    @PostMapping(value = "/cancel/{orderId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> cancelPayment(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("orderId") String orderId, @RequestParam("amount") Long amount) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "momo", "cancel")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("orderId bắt buộc để hủy giao dịch");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(momoService.handleCancelMomoPayment(orderId, amount));
    }
}
