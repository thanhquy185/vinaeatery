package vn.tuhoc.vinaeatery.modules.active.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseFoodEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.MessageMapper;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.OrderSheetMapper;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.UseTableMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseTableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.UseTableUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.MessageInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.OrderSheetInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.UseTableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.UseTableNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.exceptions.UseTableNotFoundByRestaurantIdTableIdAndEndAtIsNull;
import vn.tuhoc.vinaeatery.modules.active.repositories.MessageRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.OrderSheetRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.UseFoodRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.UseTableRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.UseTableCriteria;
import vn.tuhoc.vinaeatery.modules.active.repositories.specifications.UseTableSpecification;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.UseTableService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.services.TimeService;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UseTableServiceImplement implements UseTableService {
    final TimeService timeService;
    final UseTableRepository useTableRepository;
    final UseFoodRepository useFoodRepository;
    final MessageRepository messageRepository;
    final OrderSheetRepository orderSheetRepository;
    final UseTableMapper useTableMapper;
    final MessageMapper messageMapper;
    final OrderSheetMapper orderSheetMapper;

    private UseTableEntity getOneById(Long id) {
        return this.useTableRepository.findOneById(id)
                .orElseThrow(() -> new UseTableNotFoundByIdException(id));
    }

    public UseTableEntity getOneByRestaurantIdTableIdAndEndAtIsNull(Integer restaurantId, Integer tableId) {
        return this.useTableRepository.findOneByRestaurantIdTableIdAndEndAtIsNull(restaurantId, tableId)
                .orElseThrow(() -> new UseTableNotFoundByRestaurantIdTableIdAndEndAtIsNull(restaurantId, tableId));
    }

    private Page<UseTableEntity> getAll(UseTableCriteria useTableCriteria) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(useTableCriteria.getSort())) {
            String sortString = useTableCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "start_at__asc" -> sort = Sort.by("startAt").ascending();
                case "start_at__desc" -> sort = Sort.by("startAt").descending();
                case "end_at__asc" -> sort = Sort.by("endAt").ascending();
                case "end_at__desc" -> sort = Sort.by("endAt").descending();
                case "table_id__asc" -> sort = Sort.by("table.id").ascending();
                case "table_id__desc" -> sort = Sort.by("table.id").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(useTableCriteria.getPage())
                && ValidationUtil.nonNull(useTableCriteria.getSize())) {
            pageable = PageRequest.of(
                    useTableCriteria.getPage(),
                    useTableCriteria.getSize(),
                    sort);
        }

        Specification<UseTableEntity> specification = UseTableSpecification.filterUseTables(useTableCriteria);

        return this.useTableRepository.findAll(specification, pageable);
    }

    @Override
    public UseTableDetailResponseDTO handleGetDetailById(Long id) {
        UseTableDetailResponseDTO useTableDetailResponseDTO = this.useTableMapper
                .entityToDetailResponse(this.getOneById(id));

        // Dữ liệu Phiếu gọi món
        List<OrderSheetEntity> orderSheetEntities = this.orderSheetRepository
                .findAllByUseTableId(useTableDetailResponseDTO.getId());
        List<OrderSheetInfoResponseDTO> orderSheetInfos = orderSheetEntities.stream()
                .map(this.orderSheetMapper::entityToInfoResponse).toList();
        useTableDetailResponseDTO.setOrderSheets(orderSheetInfos);

        return useTableDetailResponseDTO;
    }

    @Override
    public UseTableCustomerResponseDTO handleGetDetailByByRestaurantIdTableIdAndEndAtIsNull(
            Integer restaurantId,
            Integer tableId) {
        UseTableCustomerResponseDTO useTableCustomerResponseDTO = this.useTableMapper
                .entityToCustomerResponse(this.getOneByRestaurantIdTableIdAndEndAtIsNull(restaurantId, tableId));

        // Dữ liệu Thực đơn
        if (ValidationUtil.nonNull(useTableCustomerResponseDTO.getMenu())
                && !useTableCustomerResponseDTO.getMenu().getMenuDetails().isEmpty()) {
            List<Integer> foodIds = useTableCustomerResponseDTO.getMenu().getMenuDetails()
                    .stream()
                    .map(menuDetail -> menuDetail.getFood().getId())
                    .toList();
            List<UseFoodEntity> useFoodEntities = useFoodRepository.findAllByFoodIds(foodIds);
            for (int i = 0; i < useTableCustomerResponseDTO.getMenu().getMenuDetails().size(); i++) {
                useTableCustomerResponseDTO.getMenu().getMenuDetails()
                        .get(i)
                        .setStatus(useFoodEntities.get(i).getStatus());
            }
        }

        // Dữ liệu Tin nhắn
        MessageEntity messageEntity = this.messageRepository
                .findOneByUseTableId(useTableCustomerResponseDTO.getId())
                .orElse(null);
        if (ValidationUtil.nonNull(messageEntity)) {
            MessageInfoResponseDTO messageInfoResponseDTO = this.messageMapper.entityToInfoResponse(messageEntity);
            useTableCustomerResponseDTO.setMessage(messageInfoResponseDTO);
        }

        // Dữ liệu Phiếu gọi món
        List<OrderSheetEntity> orderSheetEntities = this.orderSheetRepository
                .findAllByUseTableId(useTableCustomerResponseDTO.getId());
        List<OrderSheetInfoResponseDTO> orderSheetInfos = orderSheetEntities.stream()
                .map(this.orderSheetMapper::entityToInfoResponse).toList();
        useTableCustomerResponseDTO.setOrderSheets(orderSheetInfos);

        return useTableCustomerResponseDTO;
    }

    @Override
    public PageResponseDTO<UseTableSummaryResponseDTO> handleGetSummary(UseTableCriteria useTableCriteria) {
        Page<UseTableSummaryResponseDTO> page = this.getAll(useTableCriteria)
                .map(this.useTableMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    public UseTableDetailResponseDTO handleCreate(UseTableCreateRequestDTO useTableCreateRequestDTO) {
        UseTableEntity useTableEntity = this.useTableMapper.createEntityFromRequest(useTableCreateRequestDTO);

        return this.useTableMapper.entityToDetailResponse(this.useTableRepository.save(useTableEntity));
    }

    @Override
    public UseTableDetailResponseDTO handleCreateByTableCreated(Integer restaurantId, Integer tableId) {
        UseTableCreateRequestDTO useTableCreateRequestDTO = UseTableCreateRequestDTO.builder()
                .restaurantId(restaurantId)
                .tableId(tableId)
                .startAt(this.timeService.getCurrentDatetime())
                .status(UseTableStatusEnum.EMPTY)
                .build();
        UseTableEntity useTableEntity = this.useTableMapper.createEntityFromRequest(useTableCreateRequestDTO);

        return this.useTableMapper.entityToDetailResponse(this.useTableRepository.save(useTableEntity));
    }

    @Override
    public UseTableDetailResponseDTO handleUpdateStatus(
            Long id,
            UseTableUpdateStatusRequestDTO useTableUpdateStatusRequestDTO) {
        UseTableEntity useTableEntityUpdated = this.getOneById(id);
        this.useTableMapper.updateStatusEntityFromRequest(
                useTableUpdateStatusRequestDTO,
                useTableEntityUpdated);

        UseTableCreateRequestDTO useTableCreateRequestDTO = UseTableCreateRequestDTO.builder()
                .restaurantId(useTableEntityUpdated.getRestaurant().getId())
                .tableId(useTableEntityUpdated.getTable().getId())
                .employeeId(useTableUpdateStatusRequestDTO.getEmployeeId())
                .menuId(useTableUpdateStatusRequestDTO.getMenuId())
                .billId(null)
                .reservationId(null)
                .startAt(this.timeService.getCurrentDatetime())
                .endAt(null)
                .status(useTableUpdateStatusRequestDTO.getStatus())
                .build();
        if (useTableUpdateStatusRequestDTO.getStatus().equals(UseTableStatusEnum.OCCUPIED)) {
            if (useTableEntityUpdated.getStatus().equals(UseTableStatusEnum.RESERVED)) {
                useTableCreateRequestDTO.setCustomerId(useTableEntityUpdated.getReservation().getCustomer().getId());
            } else if (useTableEntityUpdated.getStatus().equals(UseTableStatusEnum.EMPTY)) {
                useTableCreateRequestDTO.setCustomerId(useTableUpdateStatusRequestDTO.getCustomerId());
            }
            useTableCreateRequestDTO.setCustomerFullname(useTableUpdateStatusRequestDTO.getCustomerFullname());
            useTableCreateRequestDTO.setCustomerPhone(useTableUpdateStatusRequestDTO.getCustomerPhone());
            useTableCreateRequestDTO.setCustomerEmail(useTableUpdateStatusRequestDTO.getCustomerEmail());
            useTableCreateRequestDTO.setCustomerAdult(useTableUpdateStatusRequestDTO.getCustomerAdult());
            useTableCreateRequestDTO.setCustomerChild(useTableUpdateStatusRequestDTO.getCustomerChild());
            useTableCreateRequestDTO.setCustomerGuests(useTableUpdateStatusRequestDTO.getCustomerGuests());
        } else if (useTableUpdateStatusRequestDTO.getStatus().equals(UseTableStatusEnum.RESERVED)) {
            useTableCreateRequestDTO.setReservationId(useTableUpdateStatusRequestDTO.getReservationId());
        } else if (useTableUpdateStatusRequestDTO.getStatus().equals(UseTableStatusEnum.EMPTY)) {

        } else if (useTableUpdateStatusRequestDTO.getStatus().equals(UseTableStatusEnum.REPAIR)) {

        }
        UseTableEntity useTableEntityCreated = this.useTableMapper.createEntityFromRequest(useTableCreateRequestDTO);

        return this.useTableMapper.entityToDetailResponse(this.useTableRepository.save(useTableEntityCreated));
    }
}