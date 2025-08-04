package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.CategoryTable;
import vn.tuhoc.vinaeatery.domain.Customer;
import vn.tuhoc.vinaeatery.domain.CustomerCard;
import vn.tuhoc.vinaeatery.domain.Order;
import vn.tuhoc.vinaeatery.domain.OrderDetail;
import vn.tuhoc.vinaeatery.domain.OrderDetailId;
import vn.tuhoc.vinaeatery.domain.UseTable;
import vn.tuhoc.vinaeatery.domain.criteria.UseTableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderSheetDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderSheetDetailDTO;
import vn.tuhoc.vinaeatery.domain.dto.UseTableDTO;
import vn.tuhoc.vinaeatery.domain.dto.UseTableUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.service.UseTableService;
import vn.tuhoc.vinaeatery.service.CategoryTableService;
import vn.tuhoc.vinaeatery.service.CustomerCardService;
import vn.tuhoc.vinaeatery.service.CustomerService;
import vn.tuhoc.vinaeatery.service.OrderDetailService;
import vn.tuhoc.vinaeatery.service.OrderService;
import vn.tuhoc.vinaeatery.service.TableService;
// import vn.tuhoc.vinaeatery.service.OrderSheetService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/use-tables")
@AllArgsConstructor
public class UseTableApiController {
    // Properties
    private final UseTableService useTableService;
    // private final OrderSheetService orderSheetService;
    private final OrderService orderService;
    private final OrderDetailService orderDetailService;
    private final CustomerCardService customerCardService;
    private final CustomerService customerService;
    private final CategoryTableService categoryTableService;
    private final TableService tableService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/{tableId}")
    public ResponseEntity<?> newUseTableByTableId(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("tableId") Integer tableId) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        UseTableDTO useTableDTO = useTableService.getNewOneFormatByTableId(tableId);
        return useTableDTO != null ? ResponseEntity.status(HttpStatus.OK).body(useTableDTO)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ValidationUtil.buildRestResponseWithStr("Bàn ăn không tồn tại trong nhà hàng !"));
    }

    @PostMapping("/list")
    public ResponseEntity<?> listUseTable(@RequestBody FormSecurityDTO formSecurityDTO,
            UseTableCriteria useTableCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<UseTable> listUseTable = this.useTableService.getAll(useTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listUseTable);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listUseTableFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            UseTableCriteria useTableCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<UseTableDTO> listUseTableFormat = this.useTableService.getAllFormat(useTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listUseTableFormat);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailUseTable(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Long id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        UseTable useTableSelected = this.useTableService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(useTableSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateUseTable(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("use-table") @Valid UseTable useTable, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        UseTable useTableCreate = this.useTableService.upsert(useTable);
        return ResponseEntity.status(HttpStatus.OK).body(useTableCreate);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateUseTable(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Long id,
            @RequestPart("use-table") @Valid UseTableUpdateDTO useTable,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        UseTable useTableUpdated = this.useTableService.getOneById(id);
        if (useTableUpdated != null) {
            useTableUpdated.setTimeEnd(timeService.getDateTimeVN(useTable.getTimeEnd()));
            useTableUpdated.setEmployeeId(useTable.getEmployeeId());
            // useTableUpdated.setStatus(useTable.getStatus());

            UseTable newUseTable = new UseTable();
            newUseTable.setTimeStart(LocalDateTime.now());
            newUseTable.setTimeEnd(null);
            newUseTable.setTableId(useTableUpdated.getTableId());
            newUseTable.setOrderId(null);
            newUseTable.setStatus(useTable.getStatus());
            if (useTable.getStatus() == UseTableStatusEnum.OCCUPIED) {
                // Nếu là "đang có khách", ngược lại là "khách nhận bàn"
                if (useTable.getCustomerId() != null) {
                    // useTableUpdated.setEmployeeId(useTable.getEmployeeId());
                    newUseTable.setCustomerId(useTable.getCustomerId());
                } else {
                    // Tạo mới khách hàng
                    Customer newCustomer = new Customer();
                    if (useTable.getOrderTableNewFullname() != null) {
                        newCustomer.setFullname(useTable.getOrderTableNewFullname());
                    }
                    if (useTable.getOrderTableNewPhone() != null) {
                        newCustomer.setPhone(useTable.getOrderTableNewPhone());
                    }
                    if (useTable.getOrderTableNewEmail() != null) {
                        newCustomer.setEmail(useTable.getOrderTableNewEmail());
                    }
                    if (useTable.getOrderTableNewAddress() != null) {
                        newCustomer.setAddress(useTable.getOrderTableNewAddress());
                    }
                    newCustomer.setCustomerCardId(1);
                    newCustomer.setTotalThreshold(0L);
                    newCustomer.setStatus(CommonStatusEnum.ACTIVE);
                    this.customerService.upsert(newCustomer);

                    // Cập nhật lại mã khách hàng và mã đơn đặt bàn
                    // useTableUpdated.setCustomerId(newCustomer.getId());
                    // useTableUpdated.setOrderTableId(null);
                    newUseTable.setCustomerId(newCustomer.getId());
                    newUseTable.setOrderTableId(null);
                }
            } else if (useTable.getStatus() == UseTableStatusEnum.RESERVED) {
                if (useTable.getOrderTableId() != null) {
                    // useTable.setOrderTableId(useTable.getOrderTableId());
                    newUseTable.setOrderTableId(useTable.getOrderTableId());
                }
            } else if (useTable.getStatus() == UseTableStatusEnum.EMPTY) {
                // Nếu là "thanh toán tiền bàn", ngược lại là "khách trả bàn"
                if (useTable.getOrderSheets() != null && !useTable.getOrderSheets().isEmpty()) {
                    // Tổng tiền thanh toán
                    Long totalPriceValue = 0L;
                    // - Tổng tiền món ăn
                    for (OrderSheetDTO orderSheet : useTable.getOrderSheets()) {
                        if (orderSheet.getStatus() == OrderSheetStatusEnum.SERVICED) {
                            totalPriceValue += orderSheet.getTotalPrice();
                        }
                    }
                    // - Phí theo loại bàn ăn
                    CategoryTable categoryTable = categoryTableService
                            .getOneById(tableService.getOneById(useTableUpdated.getTableId()).getCategoryTableId());
                    if (categoryTable != null && categoryTable.getSurchargeValue() != null
                            && categoryTable.getSurchargeValue() > 0) {
                        if (categoryTable.getSurchargeType().equals("Phần trăm hoá đơn")) {
                            totalPriceValue += totalPriceValue * categoryTable.getSurchargeValue() / 100;
                        } else if (categoryTable.getSurchargeType().equals("Tiền cố định")) {
                            totalPriceValue += categoryTable.getSurchargeValue();
                        }
                    }
                    // - Giảm giá theo loại thẻ khách hàng
                    CustomerCard customerCard = customerCardService.getOneById(
                            customerService.getOneById(useTableUpdated.getCustomerId()).getCustomerCardId());
                    if (customerCard != null && customerCard.getDiscount() != null && customerCard.getDiscount() > 0) {
                        totalPriceValue -= totalPriceValue * customerCard.getDiscount() / 100;
                    }

                    // Tạo đơn hàng mới
                    Order newOrder = new Order();
                    newOrder.setTimeCreate(LocalDateTime.now());
                    newOrder.setEmployeeId(useTable.getEmployeeId());
                    newOrder.setCustomerId(useTableUpdated.getCustomerId());
                    newOrder.setTotalPrice(totalPriceValue);
                    newOrder.setPayStatus(PayStatusEnum.PAY);
                    newOrder.setStatus(OrderStatusEnum.CONFIRM);

                    // Cập nhật tổng tiền chi tiêu cho khách hàng
                    Customer customer = customerService.getOneById(useTableUpdated.getCustomerId());
                    customer.setTotalThreshold(customer.getTotalThreshold() + totalPriceValue);

                    // Cập nhật chi tiết đơn hàng
                    Order newOrderAfterHandle = this.orderService.upsert(newOrder);
                    if (newOrderAfterHandle != null) {
                        useTableUpdated.setOrderId(newOrderAfterHandle.getId());
                        // newUseTable.setOrderId(newOrderAfterHandle.getId());

                        for (OrderSheetDTO orderSheet : useTable.getOrderSheets()) {
                            if (orderSheet.getStatus() == OrderSheetStatusEnum.SERVICED) {
                                for (OrderSheetDetailDTO orderSheetDetail : orderSheet.getOrderSheetDetails()) {
                                    OrderDetail newOrderDetail = new OrderDetail();
                                    newOrderDetail.setId(new OrderDetailId(newOrderAfterHandle.getId(),
                                            orderSheetDetail.getFood().getId()));
                                    newOrderDetail.setPrice(orderSheetDetail.getPrice());
                                    newOrderDetail.setQuantity(orderSheetDetail.getQuantity());

                                    this.orderDetailService.upsert(newOrderDetail);
                                }
                            }
                            // else if (orderSheet.getStatus() == OrderSheetStatusEnum.CONFIRM
                            // || orderSheet.getStatus() == OrderSheetStatusEnum.PENDING) {
                            // OrderSheet orderSheetCancel =
                            // orderSheetService.getOneById(orderSheet.getId());
                            // orderSheetCancel.setStatus(OrderSheetStatusEnum.CANCELLED);
                            // this.orderSheetService.upsert(orderSheetCancel);
                            // }
                        }
                    }
                } else {

                }

                // useTableUpdated.setCustomerId(null);
                newUseTable.setCustomerId(null);
            } else if (useTable.getStatus() == UseTableStatusEnum.REPAIR) {

            }

            this.useTableService.upsert(useTableUpdated);
            this.useTableService.upsert(newUseTable);
        }

        return ResponseEntity.status(HttpStatus.OK).body(useTableUpdated);
    }
}