package vn.tuhoc.vinaeatery.modules.dashboard.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.enums.ExpenseTypeEnum;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.enums.TimelineEnum;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.ExpenseRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseBarChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseCardResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseIngredientTableBodyResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseIngredientTableFootResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseInputTicketTableBodyResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseInputTicketTableFootResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpensePieChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseSupplierTableBodyResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseSupplierTableFootResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ExpenseTableResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.PieChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.TimeRangeResponseDTO;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketDetailEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.SupplierEntity;
import vn.tuhoc.vinaeatery.modules.food.repositories.InputTicketRepository;
import vn.tuhoc.vinaeatery.modules.food.repositories.SupplierRepository;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapper;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.RestaurantRepository;
import vn.tuhoc.vinaeatery.utils.TimeRangeUtil;

@Service
@RequiredArgsConstructor
public class ExpenseService {
        private final RestaurantRepository restaurantRepository;
        private final InputTicketRepository inputTicketRepository;
        private final SupplierRepository supplierRepository;
        private final RestaurantMapper restaurantMapper;

        private ExpenseResponseDTO handleDashboardTypeInputTicket(ExpenseRequestDTO expenseRequestDTO) {
                int restaurantId = expenseRequestDTO.getRestaurantId();

                //
                List<String> barXAxis = new ArrayList<>();
                List<Long> barSeries = new ArrayList<>();
                List<ExpenseInputTicketTableBodyResponseDTO> tableBody = new ArrayList<>();
                //
                List<TimeRangeResponseDTO> timeRangeResponseDTOs = TimeRangeUtil.getTimeRanges(
                                expenseRequestDTO.getTimeline(),
                                expenseRequestDTO.getTimeDetail());
                //
                List<InputTicketEntity> inputTicketsInTimeRange = this.inputTicketRepository
                                .findAllWithDetailsInTimeRange(
                                                restaurantId,
                                                timeRangeResponseDTOs.get(0).getStart(),
                                                timeRangeResponseDTOs
                                                                .get(timeRangeResponseDTOs.size() - 1)
                                                                .getEnd());
                //
                int inputTicketIndex = 0;
                for (TimeRangeResponseDTO timeRangeResponseDTO : timeRangeResponseDTOs) {
                        String label = timeRangeResponseDTO.getLabel();
                        String start = timeRangeResponseDTO.getStart();
                        String end = timeRangeResponseDTO.getEnd();

                        int inputTicket = 0;
                        long quantity = 0;
                        long expense = 0;
                        while (inputTicketIndex < inputTicketsInTimeRange.size()) {
                                InputTicketEntity inputTicketEntity = inputTicketsInTimeRange.get(inputTicketIndex);

                                String inputTicketCreateAt = inputTicketEntity.getCreateAt();
                                if (inputTicketCreateAt.compareTo(start) < 0) {
                                        inputTicketIndex++;
                                        continue;
                                }
                                if (inputTicketCreateAt.compareTo(end) > 0) {
                                        break;
                                }

                                inputTicket++;
                                quantity += inputTicketEntity.getInputTicketDetails()
                                                .stream()
                                                .mapToLong(InputTicketDetailEntity::getQuantity)
                                                .sum();
                                expense += inputTicketEntity.getTotalInputPrice();
                                inputTicketIndex++;
                        }

                        ExpenseInputTicketTableBodyResponseDTO expenseInputTicketTableBodyResponseDTO = ExpenseInputTicketTableBodyResponseDTO
                                        .builder()
                                        .label(label)
                                        .start(start)
                                        .end(end)
                                        .inputTicket(inputTicket)
                                        .quantity(quantity)
                                        .expense(expense)
                                        .build();

                        barXAxis.add(label.replace(
                                        expenseRequestDTO.getTimeline().equals(TimelineEnum.YEAR) ? "áng " : "ần ",
                                        ""));
                        barSeries.add(expense);
                        tableBody.add(expenseInputTicketTableBodyResponseDTO);
                }
                //
                long cardTotal = barSeries.stream().reduce(0L, Long::sum);
                double cardAverage = barSeries.stream()
                                .mapToLong(Long::longValue)
                                .average()
                                .orElse(0D);
                long cardMax = barSeries.stream()
                                .max(Long::compareTo)
                                .orElse(0L);
                long cardMin = barSeries.stream()
                                .min(Long::compareTo)
                                .orElse(0L);
                ExpenseBarChartResponseDTO barChart = ExpenseBarChartResponseDTO.builder()
                                .xAxis(barXAxis)
                                .series(barSeries)
                                .build();
                ExpenseInputTicketTableFootResponseDTO tableFoot = ExpenseInputTicketTableFootResponseDTO.builder()
                                .totalInputTicket(tableBody.stream()
                                                .mapToLong(ExpenseInputTicketTableBodyResponseDTO::getInputTicket)
                                                .sum())
                                .totalQuantity(tableBody.stream()
                                                .mapToLong(ExpenseInputTicketTableBodyResponseDTO::getQuantity).sum())
                                .totalExpense(tableBody.stream()
                                                .mapToLong(ExpenseInputTicketTableBodyResponseDTO::getExpense).sum())
                                .build();

                ExpenseCardResponseDTO card = ExpenseCardResponseDTO.builder()
                                .total(cardTotal)
                                .average(cardAverage)
                                .max(cardMax)
                                .min(cardMin)
                                .build();
                ExpenseChartResponseDTO chart = ExpenseChartResponseDTO.builder()
                                .bar(barChart)
                                .build();
                ExpenseTableResponseDTO table = ExpenseTableResponseDTO.builder()
                                .inputTicketTableBody(tableBody)
                                .inputTicketTableFoot(tableFoot)
                                .build();

                return ExpenseResponseDTO.builder()
                                .dateStart(tableBody.get(0).getStart())
                                .dateEnd(tableBody.get(tableBody.size() - 1).getEnd())
                                .card(card)
                                .chart(chart)
                                .table(table)
                                .build();
        }

        private ExpenseResponseDTO handleDashboardTypeIngredient(ExpenseRequestDTO expenseRequestDTO) {
                int restaurantId = expenseRequestDTO.getRestaurantId();

                //
                List<PieChartResponseDTO> data = new ArrayList<>();
                List<ExpenseIngredientTableBodyResponseDTO> tableBody = new ArrayList<>();
                //
                List<TimeRangeResponseDTO> timeRangeResponseDTOs = TimeRangeUtil.getTimeRanges(
                                expenseRequestDTO.getTimeline(),
                                expenseRequestDTO.getTimeDetail());
                //
                List<InputTicketEntity> inputTicketWithDetailsInTimeRange = this.inputTicketRepository
                                .findAllWithDetailsInTimeRange(
                                                restaurantId,
                                                timeRangeResponseDTOs.get(0).getStart(),
                                                timeRangeResponseDTOs
                                                                .get(timeRangeResponseDTOs.size() - 1)
                                                                .getEnd());
                List<InputTicketDetailEntity> inputTicketDetailEntities = inputTicketWithDetailsInTimeRange.stream()
                                .flatMap(InputTicketEntity -> InputTicketEntity.getInputTicketDetails().stream())
                                .sorted(Comparator
                                                .comparing(InputTicketDetailEntity::getIngredientNameSnapshot,
                                                                String.CASE_INSENSITIVE_ORDER)
                                                .thenComparing(InputTicketDetailEntity::getIngredientInputPriceSnapshot))
                                .toList();
                //
                Set<Integer> existsNameAndInputPrice = new HashSet<>();
                Set<Integer> existsName = new HashSet<>();
                for (int i = 0; i < inputTicketDetailEntities.size(); i++) {
                        if (existsNameAndInputPrice.contains(i)) {
                                continue;
                        }

                        String currentName = inputTicketDetailEntities.get(i).getIngredientNameSnapshot();
                        long currentInputPrice = inputTicketDetailEntities.get(i).getInputPrice();
                        long currentQuantity = inputTicketDetailEntities.get(i).getQuantity();
                        long currentExpense = inputTicketDetailEntities.get(i).getTotalInputPriceDetail();
                        int rowSpan = 1;

                        Set<Long> differentInputPrice = new LinkedHashSet<>();
                        differentInputPrice.add(currentInputPrice);

                        int j = i + 1;
                        while (j < inputTicketDetailEntities.size()
                                        && currentName.equalsIgnoreCase(
                                                        inputTicketDetailEntities.get(j).getIngredientNameSnapshot())) {
                                InputTicketDetailEntity inputTicketDetailEntityNext = inputTicketDetailEntities.get(j);
                                if (currentInputPrice == inputTicketDetailEntityNext.getInputPrice()) {
                                        currentQuantity += inputTicketDetailEntityNext.getQuantity();
                                        currentExpense += inputTicketDetailEntityNext.getTotalInputPriceDetail();

                                        existsNameAndInputPrice.add(j);
                                        j++;

                                        continue;
                                } else {
                                        differentInputPrice.add(inputTicketDetailEntityNext.getInputPrice());
                                }

                                existsName.add(j);
                                j++;
                        }
                        rowSpan = differentInputPrice.size();

                        PieChartResponseDTO pieChartResponseDTO = PieChartResponseDTO.builder()
                                        .id(inputTicketDetailEntities.get(i).getId().getIngredientId())
                                        .label(currentName)
                                        .value(currentExpense)
                                        .build();
                        ExpenseIngredientTableBodyResponseDTO expenseIngredientTableBodyResponseDTO = ExpenseIngredientTableBodyResponseDTO
                                        .builder()
                                        .name(currentName)
                                        .inputPrice(currentInputPrice)
                                        .quantity(currentQuantity)
                                        .expense(currentExpense)
                                        .rowSpan(existsName.contains(i) ? 0 : rowSpan)
                                        .build();

                        data.add(pieChartResponseDTO);
                        tableBody.add(expenseIngredientTableBodyResponseDTO);
                }
                //
                long cardTotal = tableBody.stream()
                                .mapToLong(ExpenseIngredientTableBodyResponseDTO::getExpense)
                                .sum();
                double cardAverage = tableBody.stream()
                                .mapToLong(ExpenseIngredientTableBodyResponseDTO::getExpense)
                                .average()
                                .orElse(0D);
                long cardMax = tableBody.stream()
                                .mapToLong(ExpenseIngredientTableBodyResponseDTO::getExpense)
                                .max()
                                .orElse(0L);
                long cardMin = tableBody.stream()
                                .mapToLong(ExpenseIngredientTableBodyResponseDTO::getExpense)
                                .min()
                                .orElse(0L);
                ExpensePieChartResponseDTO pieChart = ExpensePieChartResponseDTO.builder()
                                .data(data)
                                .build();
                ExpenseIngredientTableFootResponseDTO tableFoot = ExpenseIngredientTableFootResponseDTO
                                .builder()
                                .totalQuantity(tableBody.stream()
                                                .mapToLong(ExpenseIngredientTableBodyResponseDTO::getQuantity).sum())
                                .totalExpense(tableBody.stream()
                                                .mapToLong(ExpenseIngredientTableBodyResponseDTO::getExpense).sum())
                                .build();

                ExpenseCardResponseDTO card = ExpenseCardResponseDTO.builder()
                                .total(cardTotal)
                                .average(cardAverage)
                                .max(cardMax)
                                .min(cardMin)
                                .build();
                ExpenseChartResponseDTO chart = ExpenseChartResponseDTO.builder()
                                .pie(pieChart)
                                .build();
                ExpenseTableResponseDTO table = ExpenseTableResponseDTO.builder()
                                .ingredientTableBody(tableBody)
                                .ingredientTableFoot(tableFoot)
                                .build();

                return ExpenseResponseDTO.builder()
                                .dateStart(timeRangeResponseDTOs.get(0).getStart())
                                .dateEnd(timeRangeResponseDTOs.get(timeRangeResponseDTOs.size() - 1).getEnd())
                                .card(card)
                                .chart(chart)
                                .table(table)
                                .build();
        }

        private ExpenseResponseDTO handleDashboardTypeSupplier(ExpenseRequestDTO expenseRequestDTO) {
                int restaurantId = expenseRequestDTO.getRestaurantId();

                //
                List<PieChartResponseDTO> data = new ArrayList<>();
                List<ExpenseSupplierTableBodyResponseDTO> tableBody = new ArrayList<>();
                //
                List<TimeRangeResponseDTO> timeRangeResponseDTOs = TimeRangeUtil.getTimeRanges(
                                expenseRequestDTO.getTimeline(),
                                expenseRequestDTO.getTimeDetail());
                //
                List<InputTicketEntity> inputTicketsInTimeRange = this.inputTicketRepository
                                .findAllWithDetailsInTimeRange(
                                                restaurantId,
                                                timeRangeResponseDTOs.get(0).getStart(),
                                                timeRangeResponseDTOs
                                                                .get(timeRangeResponseDTOs.size() - 1)
                                                                .getEnd());
                inputTicketsInTimeRange
                                .sort(Comparator.comparing(
                                                inputTicketEntity -> inputTicketEntity.getSupplier().getId()));
                List<SupplierEntity> suppliers = this.supplierRepository.findAllByRestaurantId(restaurantId);
                //
                int inputTicketIndex = 0;
                for (SupplierEntity supplierEntity : suppliers) {
                        String supplierFullname = supplierEntity.getFullname();

                        int inputTicket = 0;
                        long quantity = 0;
                        long expense = 0;

                        while (inputTicketIndex < inputTicketsInTimeRange.size()) {
                                InputTicketEntity inputTicketEntity = inputTicketsInTimeRange.get(inputTicketIndex);

                                if (supplierEntity.getId().equals(inputTicketEntity.getSupplier().getId())) {
                                        inputTicket++;
                                        quantity += inputTicketEntity.getInputTicketDetails()
                                                        .stream()
                                                        .mapToLong(InputTicketDetailEntity::getQuantity)
                                                        .sum();
                                        expense += inputTicketEntity.getTotalInputPrice();
                                        inputTicketIndex++;
                                } else {
                                        break;
                                }
                        }

                        PieChartResponseDTO pieChartResponseDTO = PieChartResponseDTO.builder()
                                        .id(supplierEntity.getId())
                                        .label(supplierFullname)
                                        .value(expense)
                                        .build();
                        ExpenseSupplierTableBodyResponseDTO expenseSupplierTableBodyResponseDTO = ExpenseSupplierTableBodyResponseDTO
                                        .builder()
                                        .supplierFullname(supplierFullname)
                                        .inputTicket(inputTicket)
                                        .quantity(quantity)
                                        .expense(expense)
                                        .build();

                        data.add(pieChartResponseDTO);
                        tableBody.add(expenseSupplierTableBodyResponseDTO);
                }
                //
                long cardTotal = tableBody.stream()
                                .mapToLong(ExpenseSupplierTableBodyResponseDTO::getExpense)
                                .sum();
                double cardAverage = tableBody.stream()
                                .mapToLong(ExpenseSupplierTableBodyResponseDTO::getExpense)
                                .average()
                                .orElse(0D);
                long cardMax = tableBody.stream()
                                .mapToLong(ExpenseSupplierTableBodyResponseDTO::getExpense)
                                .max()
                                .orElse(0L);
                long cardMin = tableBody.stream()
                                .mapToLong(ExpenseSupplierTableBodyResponseDTO::getExpense)
                                .min()
                                .orElse(0L);
                ExpensePieChartResponseDTO pieChart = ExpensePieChartResponseDTO.builder()
                                .data(data)
                                .build();
                ExpenseSupplierTableFootResponseDTO tableFoot = ExpenseSupplierTableFootResponseDTO
                                .builder()
                                .totalInputTicket(tableBody.stream()
                                                .mapToLong(ExpenseSupplierTableBodyResponseDTO::getInputTicket).sum())
                                .totalQuantity(tableBody.stream()
                                                .mapToLong(ExpenseSupplierTableBodyResponseDTO::getQuantity).sum())
                                .totalExpense(tableBody.stream()
                                                .mapToLong(ExpenseSupplierTableBodyResponseDTO::getExpense).sum())
                                .build();

                ExpenseCardResponseDTO card = ExpenseCardResponseDTO.builder()
                                .total(cardTotal)
                                .average(cardAverage)
                                .max(cardMax)
                                .min(cardMin)
                                .build();
                ExpenseChartResponseDTO chart = ExpenseChartResponseDTO.builder()
                                .pie(pieChart)
                                .build();
                ExpenseTableResponseDTO table = ExpenseTableResponseDTO.builder()
                                .supplierTableBody(tableBody)
                                .supplierTableFoot(tableFoot)
                                .build();

                return ExpenseResponseDTO.builder()
                                .dateStart(timeRangeResponseDTOs.get(0).getStart())
                                .dateEnd(timeRangeResponseDTOs.get(timeRangeResponseDTOs.size() - 1).getEnd())
                                .card(card)
                                .chart(chart)
                                .table(table)
                                .build();
        }

        @Cacheable(value = "dashboard__expense", key = "'restaurantId=' + #expenseRequestDTO.getRestaurantId() + 'type=' + #expenseRequestDTO.getType() + 'timeline=' + #expenseRequestDTO.getTimeline() + 'timeDetail=' + #expenseRequestDTO.getTimeDetail()", unless = "#result == null")
        public ExpenseResponseDTO handleDashboard(ExpenseRequestDTO expenseRequestDTO) {
                ExpenseTypeEnum type = expenseRequestDTO.getType();

                ExpenseResponseDTO expenseResponseDTO = null;
                if (type.equals(ExpenseTypeEnum.INPUT_TICKET)) {
                        expenseResponseDTO = this.handleDashboardTypeInputTicket(expenseRequestDTO);
                } else if (type.equals(ExpenseTypeEnum.INGREDIENT)) {
                        expenseResponseDTO = this.handleDashboardTypeIngredient(expenseRequestDTO);
                } else if (type.equals(ExpenseTypeEnum.SUPPLIER)) {
                        expenseResponseDTO = this.handleDashboardTypeSupplier(expenseRequestDTO);
                }

                RestaurantSubInfoResponseDTO restaurant = this.restaurantMapper
                                .entityToSubInfoResponse(
                                                this.restaurantRepository
                                                                .findOneByIdToCrud(expenseRequestDTO.getRestaurantId())
                                                                .get());
                expenseResponseDTO.setRestaurant(restaurant);

                return expenseResponseDTO;
        }
}
