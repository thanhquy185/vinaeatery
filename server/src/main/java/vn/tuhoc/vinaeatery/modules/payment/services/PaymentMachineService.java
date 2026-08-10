package vn.tuhoc.vinaeatery.modules.payment.services;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillPaymentStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.MenuTypeEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.BillDetailMapper;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.BillMapper;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.FeedbackMapper;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.UseTableMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillDetailCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.FeedbackCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseTableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.UseTableNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.repositories.BillRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.FeedbackRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.UseTableRepository;
import vn.tuhoc.vinaeatery.modules.global.services.SocketService;
import vn.tuhoc.vinaeatery.modules.global.services.TimeService;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineFoodEntity;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineProcessStatusEnum;
import vn.tuhoc.vinaeatery.modules.payment.domains.enums.PaymentMachineStatusEnum;
import vn.tuhoc.vinaeatery.modules.payment.domains.mappers.PaymentMachineFoodMapper;
import vn.tuhoc.vinaeatery.modules.payment.domains.mappers.PaymentMachineMapper;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.PaymentMachineCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.PaymentMachineFoodCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.requests.PaymentMachineUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.payment.dtos.responses.PaymentMachineDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMachineExistsOneIsHandlingException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMachineNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMachineNotFoundByPaymentIdException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMachineNotFoundByUseTableIdException;
import vn.tuhoc.vinaeatery.modules.payment.repositories.PaymentMachineRepository;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.CategoryTableEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.enums.CategoryTableSurchargeTypeEnum;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentMachineService {
        private final EntityManager entityManager;
        private final SocketService socketService;
        private final TimeService timeService;
        private final PaymentMachineRepository paymentMachineRepository;
        private final UseTableRepository useTableRepository;
        private final FeedbackRepository feedbackRepository;
        private final BillRepository billRepository;
        private final PaymentMachineMapper paymentMachineMapper;
        private final PaymentMachineFoodMapper paymentMachineFoodMapper;
        private final UseTableMapper useTableMapper;
        private final FeedbackMapper feedbackMapper;
        private final BillMapper billMapper;
        private final BillDetailMapper billDetailMapper;

        public PaymentMachineEntity getOneById(Integer id) {
                return this.paymentMachineRepository.findOneById(id)
                                .orElseThrow(() -> new PaymentMachineNotFoundByIdException(id));
        }

        public PaymentMachineEntity getOneByUseTableId(Integer useTableId) {
                return this.paymentMachineRepository.findOneByUseTableId(useTableId)
                                .orElseThrow(() -> new PaymentMachineNotFoundByUseTableIdException(useTableId));
        }

        public PaymentMachineEntity getOneByPaymentId(String paymentId) {
                return this.paymentMachineRepository.findOneByPaymentId(paymentId)
                                .orElseThrow(() -> new PaymentMachineNotFoundByPaymentIdException(paymentId));
        }

        public PaymentMachineDetailResponseDTO handleGetDetailById(Integer id) {
                return this.paymentMachineMapper.entityToDetailResponse(this.getOneById(id));
        }

        public PaymentMachineDetailResponseDTO handleGetDetailByUseTableId(Integer useTableId) {
                return this.paymentMachineMapper.entityToDetailResponse(this.getOneByUseTableId(useTableId));
        }

        private PaymentMachineEntity handleInfo(
                        PaymentMachineEntity paymentMachineEntity,
                        Long useTableId,
                        Boolean isCreate) {
                // Truy vấn dữ liệu Sử dụng bàn ăn
                UseTableEntity useTableEntity = this.useTableRepository
                                .findOneById(useTableId)
                                .orElseThrow(() -> new UseTableNotFoundByIdException(useTableId));
                // - Thực đơn
                MenuEntity menuEntity = useTableEntity.getMenu();
                // - Danh sách phiếu gọi món
                Map<Integer, OrderSheetDetailEntity> orderSheetDetailMap = new LinkedHashMap<>();
                for (OrderSheetEntity orderSheetEntity : useTableEntity.getOrderSheets()) {
                        if (orderSheetEntity.getStatus().equals(OrderSheetStatusEnum.PENDING)
                                        || orderSheetEntity.getStatus().equals(OrderSheetStatusEnum.CANCELLED)) {
                                continue;
                        }

                        for (OrderSheetDetailEntity orderSheetDetailEntity : orderSheetEntity.getOrderSheetDetails()) {
                                Integer foodId = orderSheetDetailEntity.getId().getFoodId();
                                OrderSheetDetailEntity existing = orderSheetDetailMap.get(foodId);

                                if (existing != null) {
                                        existing.setQuantity(
                                                        existing.getQuantity() + orderSheetDetailEntity.getQuantity());
                                } else {
                                        orderSheetDetailMap.put(foodId, orderSheetDetailEntity);
                                }
                        }
                }
                List<OrderSheetDetailEntity> orderSheetDetailEntities = new ArrayList<>(orderSheetDetailMap.values());

                // Tính tổng tiền hoá đơn
                // - Tổng tiền phiếu gọi món
                Long foodPrice = menuEntity.getType().equals(MenuTypeEnum.ALA_CARTE)
                                ? orderSheetDetailEntities.stream()
                                                .mapToLong(OrderSheetDetailEntity::getTotalPriceDetail)
                                                .sum()
                                : menuEntity.getPrice() * useTableEntity.getCustomerAdult();
                // - Tiền phụ thu loại bàn ăn
                CategoryTableEntity categoryTableEntity = useTableEntity.getTable().getCategoryTable();
                Long categoryTableSurcharge = categoryTableEntity.getSurchargeType()
                                .equals(CategoryTableSurchargeTypeEnum.PERCENT)
                                                ? Math.round(
                                                                (1.0 * foodPrice * categoryTableEntity
                                                                                .getSurchargeValue() / 100))
                                                : categoryTableEntity.getSurchargeValue();
                // - Giảm giá khách hàng
                Long customerDiscount = 0L;
                // - Tổng tiền
                Long totalPrice = foodPrice + categoryTableSurcharge + customerDiscount;
                // Thanh toán POS - Món ăn
                if (!isCreate) {
                        paymentMachineEntity.getPaymentMachineFoods().clear();
                        this.entityManager.flush();
                }
                orderSheetDetailEntities.stream().forEach((orderSheetDetailEntity) -> {
                        PaymentMachineFoodCreateRequestDTO paymentMachineFoodCreateRequestDTO = PaymentMachineFoodCreateRequestDTO
                                        .builder()
                                        .foodId(orderSheetDetailEntity.getId().getFoodId())
                                        .price(orderSheetDetailEntity.getPrice())
                                        .quantity(orderSheetDetailEntity.getQuantity())
                                        .foodNameSnapshot(orderSheetDetailEntity.getFoodNameSnapshot())
                                        .foodUnitSnapshot(orderSheetDetailEntity.getFoodUnitSnapshot())
                                        .foodPriceSnapshot(orderSheetDetailEntity.getFoodPriceSnapshot())
                                        .totalPriceDetail(orderSheetDetailEntity.getTotalPriceDetail())
                                        .build();

                        PaymentMachineFoodEntity paymentMachineFoodEntity = this.paymentMachineFoodMapper
                                        .createEntityFromRequest(paymentMachineFoodCreateRequestDTO);

                        paymentMachineEntity.addPaymentMachineFood(paymentMachineFoodEntity);
                });
                // Xử lý
                paymentMachineEntity.setFoodPrice(foodPrice);
                paymentMachineEntity.setCategoryTableSurcharge(categoryTableSurcharge);
                paymentMachineEntity.setCustomerDiscount(customerDiscount);
                paymentMachineEntity.setTotalPrice(totalPrice);

                if (isCreate) {
                        PaymentMachineEntity paymentMachineEntityCreated = this.paymentMachineRepository
                                        .save(paymentMachineEntity);

                        useTableEntity.setPaymentMachine(paymentMachineEntityCreated);

                        return paymentMachineEntityCreated;
                }

                useTableEntity.setPaymentMachine(paymentMachineEntity);

                return paymentMachineEntity;
        }

        private void handlePayment(
                        PaymentMachineEntity paymentMachineEntity,
                        String paymentId,
                        Integer paymentMethodId,
                        Long paymentTotalPrice) {
                // Cập nhật Thanh toán POS
                paymentMachineEntity.setPaymentId(paymentId);
                paymentMachineEntity.setPaymentTotalPrice(paymentTotalPrice);

                // Đối tượng Sử dụng bàn ăn
                UseTableEntity useTableEntity = paymentMachineEntity.getUseTable();
                // Ngày giờ hiện tại
                String currentDatetime = this.timeService.getCurrentDatetime();

                // Tạo hoá đơn mới
                // - Hoá đơn
                BillCreateRequestDTO billCreateRequestDTO = BillCreateRequestDTO.builder()
                                .restaurantId(useTableEntity.getRestaurant().getId())
                                .employeeId(useTableEntity.getEmployee().getId())
                                .customerId(useTableEntity.getCustomer().getId())
                                .createAt(currentDatetime)
                                .customerFullname(useTableEntity.getCustomerFullname())
                                .customerPhone(useTableEntity.getCustomerPhone())
                                .customerEmail(useTableEntity.getCustomerEmail())
                                .totalPrice(paymentMachineEntity.getTotalPrice())
                                .status(BillStatusEnum.CONFIRMED)
                                .paymentId(paymentId)
                                .paymentMethodId(paymentMethodId)
                                .paymentAt(currentDatetime)
                                .paymentTotalPrice(paymentTotalPrice)
                                .paymentStatus(BillPaymentStatusEnum.PAID)
                                .build();
                BillEntity billEntity = this.billMapper.createEntityFromRequest(billCreateRequestDTO);
                // - Chi tiết hoá đơn
                paymentMachineEntity.getPaymentMachineFoods().stream().forEach((paymentMachineFoodEntity) -> {
                        BillDetailCreateRequestDTO billDetailCreateRequestDTO = BillDetailCreateRequestDTO.builder()
                                        .foodId(paymentMachineFoodEntity.getId().getFoodId())
                                        .price(paymentMachineFoodEntity.getPrice())
                                        .quantity(paymentMachineFoodEntity.getQuantity())
                                        .foodNameSnapshot(paymentMachineFoodEntity.getFoodNameSnapshot())
                                        .foodUnitSnapshot(paymentMachineFoodEntity.getFoodUnitSnapshot())
                                        .foodPriceSnapshot(paymentMachineFoodEntity.getFoodPriceSnapshot())
                                        .totalPriceDetail(paymentMachineFoodEntity.getTotalPriceDetail())
                                        .build();

                        BillDetailEntity billDetailEntity = this.billDetailMapper
                                        .createEntityFromRequest(billDetailCreateRequestDTO);

                        billEntity.addBillDetail(billDetailEntity);
                });
                // - Xử lý
                BillEntity billEntityCreated = this.billRepository.save(billEntity);

                // Cập nhật SDBA hiện tại
                useTableEntity.setBill(billEntityCreated);
        }

        public PaymentMachineDetailResponseDTO handleCreate(
                        PaymentMachineCreateRequestDTO paymentMachineCreateRequestDTO) {
                PaymentMachineEntity paymentMachineIsHandling = this.paymentMachineRepository.findOneIsHandling();
                if (ValidationUtil.nonNull(paymentMachineIsHandling)) {
                        throw new PaymentMachineExistsOneIsHandlingException(
                                        paymentMachineIsHandling.getUseTable().getTable().getName());
                }

                PaymentMachineEntity paymentMachineEntity = this.paymentMachineMapper
                                .createEntityFromRequest(paymentMachineCreateRequestDTO);
                PaymentMachineEntity paymentMachineEntityCreated = this.handleInfo(
                                paymentMachineEntity,
                                paymentMachineCreateRequestDTO.getUseTableId(),
                                true);

                return this.paymentMachineMapper.entityToDetailResponse(paymentMachineEntityCreated);
        }

        public PaymentMachineDetailResponseDTO handleUpdate(
                        Integer id,
                        PaymentMachineUpdateRequestDTO paymentMachineUpdateRequestDTO) {
                PaymentMachineEntity paymentMachineIsHandling = this.paymentMachineRepository.findOneIsHandling();
                if (ValidationUtil.nonNull(paymentMachineIsHandling)
                                && !paymentMachineIsHandling.getId().equals(id)) {
                        throw new PaymentMachineExistsOneIsHandlingException(
                                        paymentMachineIsHandling.getUseTable().getTable().getName());
                }

                PaymentMachineEntity paymentMachineEntity = this.getOneById(id);
                PaymentMachineProcessStatusEnum oldProcessStatus = paymentMachineEntity.getProcessStatus();
                PaymentMachineStatusEnum oldStatus = paymentMachineEntity.getStatus();

                this.paymentMachineMapper.updateEntityFromRequest(
                                paymentMachineUpdateRequestDTO,
                                paymentMachineEntity);

                if (paymentMachineUpdateRequestDTO.getProcessStatus()
                                .equals(PaymentMachineProcessStatusEnum.PENDING)
                                && paymentMachineUpdateRequestDTO.getStatus()
                                                .equals(PaymentMachineStatusEnum.PROCESSING)) {
                        paymentMachineEntity.setPaymentMethod(null);

                        if (oldProcessStatus.equals(PaymentMachineProcessStatusEnum.CANCELLED)
                                        && oldStatus.equals(PaymentMachineStatusEnum.CANCELLED)) {
                                this.handleInfo(
                                                paymentMachineEntity,
                                                paymentMachineEntity.getUseTable().getId(),
                                                false);
                        }
                }
                if (paymentMachineUpdateRequestDTO.getProcessStatus()
                                .equals(PaymentMachineProcessStatusEnum.FEEDBACK)
                                && paymentMachineUpdateRequestDTO.getStatus()
                                                .equals(PaymentMachineStatusEnum.PROCESSING)) {
                        String paymentId = null;
                        if (paymentMachineUpdateRequestDTO.getPaymentMethodId() == 1) {
                                paymentId = "TM-" + System.currentTimeMillis();
                        } else if (paymentMachineUpdateRequestDTO.getPaymentMethodId() == 2) {
                                paymentId = "NH-" + System.currentTimeMillis();
                        } else if (paymentMachineUpdateRequestDTO.getPaymentMethodId() == 3) {
                                paymentId = "QT-" + System.currentTimeMillis();
                        }

                        this.handlePayment(
                                        paymentMachineEntity,
                                        paymentId,
                                        paymentMachineUpdateRequestDTO.getPaymentMethodId(),
                                        paymentMachineUpdateRequestDTO.getPaymentTotalPrice());
                }
                if (paymentMachineUpdateRequestDTO.getProcessStatus().equals(PaymentMachineProcessStatusEnum.COMPLETED)
                                && paymentMachineUpdateRequestDTO.getStatus()
                                                .equals(PaymentMachineStatusEnum.COMPLETED)) {
                        // Ngày giờ hiện tại
                        String currentDatetime = this.timeService.getCurrentDatetime();

                        // Tạo đánh giá mới
                        FeedbackCreateRequestDTO feedbackCreateRequestDTO = FeedbackCreateRequestDTO.builder()
                                        .at(currentDatetime)
                                        .restaurantId(paymentMachineEntity.getRestaurant().getId())
                                        .customerId(paymentMachineEntity.getUseTable().getCustomer().getId())
                                        .experience(paymentMachineUpdateRequestDTO.getFeedbackExperience())
                                        .score1(paymentMachineUpdateRequestDTO.getFeedbackScore1())
                                        .score2(paymentMachineUpdateRequestDTO.getFeedbackScore2())
                                        .score3(paymentMachineUpdateRequestDTO.getFeedbackScore3())
                                        .score4(paymentMachineUpdateRequestDTO.getFeedbackScore4())
                                        .score5(paymentMachineUpdateRequestDTO.getFeedbackScore5())
                                        .message(paymentMachineUpdateRequestDTO.getFeedbackMessage())
                                        .build();
                        FeedbackEntity feedbackEntity = this.feedbackMapper
                                        .createEntityFromRequest(feedbackCreateRequestDTO);
                        FeedbackEntity feedbackEntityCreated = this.feedbackRepository.save(feedbackEntity);

                        // Cập nhật SDBA hiện tại
                        UseTableEntity useTableEntityUpdated = paymentMachineEntity.getUseTable();
                        useTableEntityUpdated.setEndAt(currentDatetime);
                        useTableEntityUpdated.setFeedback(feedbackEntityCreated);
                        // Tạo SDBA mới
                        UseTableCreateRequestDTO useTableCreateRequestDTO = UseTableCreateRequestDTO.builder()
                                        .restaurantId(useTableEntityUpdated.getRestaurant().getId())
                                        .tableId(useTableEntityUpdated.getTable().getId())
                                        .employeeId(paymentMachineEntity.getEmployee().getId())
                                        .startAt(currentDatetime)
                                        .status(UseTableStatusEnum.EMPTY)
                                        .build();
                        UseTableEntity newUseTableEntity = this.useTableMapper
                                        .createEntityFromRequest(useTableCreateRequestDTO);
                        this.useTableRepository.save(newUseTableEntity);
                }

                return this.paymentMachineMapper.entityToDetailResponse(paymentMachineEntity);
        }

        public PaymentMachineDetailResponseDTO handleUpdateByWallet(
                        String orderId,
                        Long amount,
                        Integer paymentMethodId) {
                PaymentMachineEntity paymentMachineEntity = this.getOneByPaymentId(orderId);
                paymentMachineEntity.setPaymentId(orderId);
                paymentMachineEntity.setPaymentTotalPrice(amount);
                paymentMachineEntity.setProcessStatus(PaymentMachineProcessStatusEnum.FEEDBACK);

                this.handlePayment(
                                paymentMachineEntity,
                                orderId,
                                paymentMachineEntity.getPaymentMethod().getId(),
                                amount);

                this.socketService.handleConvertAndSend("/topic/feedback-payment-machine", "");

                return this.paymentMachineMapper.entityToDetailResponse(paymentMachineEntity);
        }
}
