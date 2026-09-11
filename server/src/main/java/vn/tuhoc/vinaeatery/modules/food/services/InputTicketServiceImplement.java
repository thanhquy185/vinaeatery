package vn.tuhoc.vinaeatery.modules.food.services;

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
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketDetailEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.InputTicketDetailMapper;
import vn.tuhoc.vinaeatery.modules.food.domains.mappers.InputTicketMapper;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketUpdatePaymentStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.requests.InputTicketUpdateStatusRequestDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.dtos.responses.InputTicketSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.exceptions.InputTicketNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.repositories.InputTicketRepository;
import vn.tuhoc.vinaeatery.modules.food.repositories.criteria.InputTicketCriteria;
import vn.tuhoc.vinaeatery.modules.food.repositories.specifications.InputTicketSpecification;
import vn.tuhoc.vinaeatery.modules.food.services.interfaces.InputTicketService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.utils.PageResponseUtil;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InputTicketServiceImplement implements InputTicketService {
        final InputTicketRepository inputTicketRepository;
        final InputTicketMapper inputTicketMapper;
        final InputTicketDetailMapper inputTicketDetailMapper;

        private InputTicketEntity getOneById(Integer id) {
                return this.inputTicketRepository.findOneById(id)
                                .orElseThrow(() -> new InputTicketNotFoundByIdException(id));
        }

        private Page<InputTicketEntity> getAll(InputTicketCriteria inputTicketCriteria) {
                Sort sort = Sort.unsorted();
                if (ValidationUtil.nonNull(inputTicketCriteria.getSort())) {
                        String sortString = inputTicketCriteria.getSort().filter(ValidationUtil::hasText).get();
                        switch (sortString) {
                                case "id__asc" -> sort = Sort.by("id").ascending();
                                case "id__desc" -> sort = Sort.by("id").descending();
                                case "create_at__asc" -> sort = Sort.by("createAt").ascending();
                                case "create_at__desc" -> sort = Sort.by("createAt").descending();
                                case "total_input_price__asc" -> sort = Sort.by("totalInputPrice").ascending();
                                case "total_input_price__desc" -> sort = Sort.by("totalInputPrice").descending();
                        }
                }

                Pageable pageable = Pageable.unpaged(sort);
                if (ValidationUtil.nonNull(inputTicketCriteria.getPage())
                                && ValidationUtil.nonNull(inputTicketCriteria.getSize())) {
                        pageable = PageRequest.of(
                                        inputTicketCriteria.getPage(),
                                        inputTicketCriteria.getSize(),
                                        sort);
                }

                Specification<InputTicketEntity> combinedSpec = InputTicketSpecification
                                .filterInputTickets(inputTicketCriteria);

                return this.inputTicketRepository.findAll(combinedSpec, pageable);
        }

        @Override
        @Cacheable(value = "input_ticket__detail", key = "#id", unless = "#result == null")
        public InputTicketDetailResponseDTO handleGetDetailById(Integer id) {
                return this.inputTicketMapper.entityToDetailResponse(this.getOneById(id));
        }

        @Override
        @Cacheable(value = "input_ticket__summary", key = "#inputTicketCriteria.getCacheKey()", unless = "#result == null")
        public PageResponseDTO<InputTicketSummaryResponseDTO> handleGetSummary(
                        InputTicketCriteria inputTicketCriteria) {
                Page<InputTicketSummaryResponseDTO> page = this.getAll(inputTicketCriteria)
                                .map(this.inputTicketMapper::entityToSummaryResponse);

                return PageResponseUtil.convert(page);
        }

        @Override
        @Caching(evict = {
                        @CacheEvict(value = "input_ticket__detail", key = "#result.id"),
                        @CacheEvict(value = "input_ticket__summary", allEntries = true),
        })
        public InputTicketDetailResponseDTO handleCreate(InputTicketCreateRequestDTO inputTicketCreateRequestDTO) {
                InputTicketEntity inputTicketEntity = this.inputTicketMapper
                                .createEntityFromRequest(inputTicketCreateRequestDTO);

                inputTicketCreateRequestDTO.getInputTicketDetails().forEach((inputTicketDetailCreateRequestDTO) -> {
                        InputTicketDetailEntity inputTicketDetailEntity = this.inputTicketDetailMapper
                                        .createEntityFromRequest(inputTicketDetailCreateRequestDTO);

                        inputTicketEntity.addInputTicketDetail(inputTicketDetailEntity);
                });

                return this.inputTicketMapper
                                .entityToDetailResponse(this.inputTicketRepository.save(inputTicketEntity));
        }

        @Override
        @Caching(put = {
                        @CachePut(value = "input_ticket__detail", key = "#id")
        }, evict = {
                        @CacheEvict(value = "input_ticket__summary", allEntries = true)
        })
        public InputTicketDetailResponseDTO handleUpdatePaymentStatus(
                        Integer id,
                        InputTicketUpdatePaymentStatusRequestDTO inputTicketUpdatePaymentStatusRequestDTO) {
                InputTicketEntity inputTicketEntity = this.getOneById(id);
                this.inputTicketMapper.updatePaymentStatusEntityFromRequest(
                                inputTicketUpdatePaymentStatusRequestDTO,
                                inputTicketEntity);

                return this.inputTicketMapper.entityToDetailResponse(inputTicketEntity);
        }

        @Override
        @Caching(put = {
                        @CachePut(value = "input_ticket__detail", key = "#id")
        }, evict = {
                        @CacheEvict(value = "input_ticket__summary", allEntries = true)
        })
        public InputTicketDetailResponseDTO handleUpdateStatus(
                        Integer id,
                        InputTicketUpdateStatusRequestDTO inputTicketUpdateStatusRequestDTO) {
                InputTicketEntity inputTicketEntity = this.getOneById(id);
                this.inputTicketMapper.updateStatusEntityFromRequest(
                                inputTicketUpdateStatusRequestDTO,
                                inputTicketEntity);

                if (inputTicketEntity.getStatus().equals(InputTicketStatusEnum.CONFIRMED)) {
                        inputTicketEntity.getInputTicketDetails().stream().forEach(((inputTicketDetailEntity) -> {
                                IngredientEntity ingredientEntity = inputTicketDetailEntity.getIngredient();
                                ingredientEntity.setInventory(ingredientEntity.getInventory()
                                                + inputTicketDetailEntity.getQuantity());
                        }));
                }

                return this.inputTicketMapper.entityToDetailResponse(inputTicketEntity);
        }
}