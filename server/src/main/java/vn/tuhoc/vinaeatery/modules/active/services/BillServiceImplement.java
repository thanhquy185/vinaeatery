package vn.tuhoc.vinaeatery.modules.active.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.BillStatusEnum;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.BillDetailMapper;
import vn.tuhoc.vinaeatery.modules.active.domains.mappers.BillMapper;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.requests.BillUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillCustomerResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillCustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillCustomerItemResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.dtos.responses.BillSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.active.exceptions.BillIngredientInsufficientInventory;
import vn.tuhoc.vinaeatery.modules.active.exceptions.BillNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.repositories.BillRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.UseTableRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.BillCriteria;
import vn.tuhoc.vinaeatery.modules.active.repositories.specifications.BillSpecification;
import vn.tuhoc.vinaeatery.modules.active.services.interfaces.BillService;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.RecipeEntity;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.domains.mappers.TableMapper;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.TableInfoResponseDTO;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillServiceImplement implements BillService {
    BillRepository billRepository;
    BillMapper billMapper;
    BillDetailMapper billDetailMapper;
    UseTableRepository useTableRepository;
    TableMapper tableMapper;

    private BillEntity getOneById(Integer id) {
        return this.billRepository.findOneById(id)
                .orElseThrow(() -> new BillNotFoundByIdException(id));
    }

    private Page<BillEntity> getAll(BillCriteria billCriteria) {
        return this.getAll(billCriteria, null);
    }

    private Page<BillEntity> getAll(BillCriteria billCriteria, Integer targetCustomerId) {
        Sort sort = Sort.unsorted();
        if (ValidationUtil.nonNull(billCriteria.getSort())) {
            String sortString = billCriteria.getSort().filter(ValidationUtil::hasText).get();
            switch (sortString) {
                case "id__asc" -> sort = Sort.by("id").ascending();
                case "id__desc" -> sort = Sort.by("id").descending();
                case "create_at__asc" -> sort = Sort.by("createAt").ascending();
                case "create_at__desc" -> sort = Sort.by("createAt").descending();
                case "total_price__asc" -> sort = Sort.by("totalPrice").ascending();
                case "total_price__desc" -> sort = Sort.by("totalPrice").descending();
            }
        }

        Pageable pageable = Pageable.unpaged(sort);
        if (ValidationUtil.nonNull(billCriteria.getPage())
                && ValidationUtil.nonNull(billCriteria.getSize())) {
            pageable = PageRequest.of(
                    billCriteria.getPage(),
                    billCriteria.getSize(),
                    sort);
        }

        Specification<BillEntity> specification = BillSpecification.filterBills(billCriteria, targetCustomerId);

        return this.billRepository.findAll(specification, pageable);
    }

    @Override
    @Cacheable(value = "bill__detail", key = "#id", unless = "#result == null")
    public BillDetailResponseDTO handleGetDetailById(Integer id) {
        return this.toDetailResponse(this.getOneById(id));
    }

    @Override
    public BillCustomerDetailResponseDTO handleGetCustomerDetailById(Integer id, Integer customerId) {
        BillEntity billEntity = this.billRepository.findOneByIdAndCustomerId(id, customerId)
                .orElseThrow(() -> new BillNotFoundByIdException(id));
        BillCustomerDetailResponseDTO response = this.billMapper.entityToCustomerDetailResponse(billEntity);
        response.setTables(this.getTablesByBillId(billEntity.getId()));
        return response;
    }

    private BillDetailResponseDTO toDetailResponse(BillEntity billEntity) {
        BillDetailResponseDTO response = this.billMapper.entityToDetailResponse(billEntity);
        response.setTables(this.getTablesByBillId(billEntity.getId()));
        return response;
    }

    private List<TableInfoResponseDTO> getTablesByBillId(Integer billId) {
        return this.useTableRepository.findAllWithTableInfoByBillId(billId).stream()
                .map(useTable -> this.tableMapper.entityToInfoResponse(useTable.getTable()))
                .toList();
    }

    @Override
    @Cacheable(value = "bill__summary", key = "#billCriteria.getCacheKey()", unless = "#result == null")
    public PageResponseDTO<BillSummaryResponseDTO> handleGetSummary(BillCriteria billCriteria) {
        Page<BillSummaryResponseDTO> page = this.getAll(billCriteria).map(this.billMapper::entityToSummaryResponse);

        return PageResponseUtil.convert(page);
    }

    @Override
    @Cacheable(
            value = "bill__customer",
            key = "#customerId + ':' + #billCriteria.getCacheKey()",
            unless = "#result == null")
    public PageResponseDTO<BillCustomerResponseDTO> handleGetAllByCustomerId(
            BillCriteria billCriteria,
            Integer customerId) {
        Page<BillEntity> billEntityPage = this.getAll(billCriteria, customerId);
        List<Integer> billIds = billEntityPage.getContent().stream()
                .map(BillEntity::getId)
                .toList();
        Map<Integer, List<BillCustomerItemResponseDTO>> itemsByBillId = billIds.isEmpty()
                ? Map.of()
                : this.billRepository.findAllByIdInWithDetails(billIds).stream()
                        .collect(Collectors.toMap(
                                BillEntity::getId,
                                bill -> bill.getBillDetails().stream()
                                        .map(detail -> new BillCustomerItemResponseDTO(
                                                detail.getFoodNameSnapshot(),
                                                detail.getFoodUnitSnapshot(),
                                                detail.getQuantity(),
                                                detail.getTotalPriceDetail()))
                                        .toList()));
        Map<Integer, List<TableInfoResponseDTO>> tablesByBillId = billIds.isEmpty()
                ? Map.of()
                : this.useTableRepository.findAllWithTableInfoByBillIds(billIds).stream()
                        .collect(Collectors.groupingBy(
                                useTable -> useTable.getBill().getId(),
                                Collectors.mapping(
                                        useTable -> this.tableMapper.entityToInfoResponse(useTable.getTable()),
                                        Collectors.toList())));

        Page<BillCustomerResponseDTO> page = billEntityPage.map(bill -> {
            BillCustomerResponseDTO response = this.billMapper.entityToCustomerResponse(bill);
            response.setItems(itemsByBillId.getOrDefault(bill.getId(), List.of()));
            response.setTables(tablesByBillId.getOrDefault(bill.getId(), List.of()));
            return response;
        });

        return PageResponseUtil.convert(page);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "bill__detail", key = "#result.id"),
            @CacheEvict(value = "bill__summary", allEntries = true),
            @CacheEvict(value = "bill__customer", allEntries = true)
    })
    public BillDetailResponseDTO handleCreate(BillCreateRequestDTO billCreateRequestDTO) {
        BillEntity billEntity = this.billMapper.createEntityFromRequest(billCreateRequestDTO);

        billCreateRequestDTO.getBillDetails().forEach((billDetailCreateRequestDTO) -> {
            BillDetailEntity billDetailEntity = this.billDetailMapper
                    .createEntityFromRequest(billDetailCreateRequestDTO);

            billEntity.addBillDetail(billDetailEntity);
        });

        return this.toDetailResponse(this.billRepository.save(billEntity));
    }

    @Override
    @Caching(put = {
            @CachePut(value = "bill__detail", key = "#id")
    }, evict = {
            @CacheEvict(value = "bill__summary", allEntries = true),
            @CacheEvict(value = "bill__customer", allEntries = true)
    })
    public BillDetailResponseDTO handleUpdateStatus(
            Integer id,
            BillUpdateStatusRequestDTO billUpdateStatusRequestDTO) {
        BillEntity billEntity = this.getOneById(id);
        this.billMapper.updateStatusEntityFromRequest(
                billUpdateStatusRequestDTO,
                billEntity);

        if (billEntity.getStatus().equals(BillStatusEnum.CONFIRMED)
                && ValidationUtil.nonNull(billEntity.getBillDetails())) {
            // Tính tổng nguyên liệu cần
            Map<IngredientEntity, Long> requiredIngredients = new HashMap<>();
            for (BillDetailEntity detail : billEntity.getBillDetails()) {
                for (RecipeEntity recipe : detail.getFood().getRecipes()) {
                    Long requiredQuantity = recipe.getQuantity() * detail.getQuantity();

                    requiredIngredients.merge(
                            recipe.getIngredient(),
                            requiredQuantity,
                            Long::sum);
                }
            }
            // Kiểm tra tồn kho
            StringBuilder message = new StringBuilder();
            for (Map.Entry<IngredientEntity, Long> entry : requiredIngredients.entrySet()) {
                IngredientEntity ingredient = entry.getKey();
                long required = entry.getValue();

                if (ingredient.getInventory() < required) {
                    if (!message.isEmpty()) {
                        message.append(" | ");
                    }

                    message.append(String.format(
                            "%s chỉ còn %d nhưng cần %d",
                            ingredient.getName(),
                            ingredient.getInventory(),
                            required));
                }
            }
            if (!message.isEmpty()) {
                throw new BillIngredientInsufficientInventory(message.toString());
            }

            billEntity.getBillDetails().stream().forEach(((billDetailEntity) -> {
                billDetailEntity.getFood().getRecipes().stream().forEach((recipe) -> {
                    IngredientEntity ingredientEntity = recipe.getIngredient();
                    ingredientEntity
                            .setInventory(ingredientEntity.getInventory()
                                    - recipe.getQuantity() * billDetailEntity.getQuantity());
                });
            }));
        }

        return this.toDetailResponse(billEntity);
    }
}
