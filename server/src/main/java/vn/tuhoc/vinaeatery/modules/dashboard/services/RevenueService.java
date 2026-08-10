package vn.tuhoc.vinaeatery.modules.dashboard.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.active.repositories.BillRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.UseTableRepository;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.enums.RevenueTypeEnum;
import vn.tuhoc.vinaeatery.modules.dashboard.domains.enums.TimelineEnum;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.RevenueRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.PieChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueBarChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueCardResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueFoodTableBodyResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueFoodTableFootResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenuePieChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueBillTableBodyResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueBillTableFootResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueTableResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueTableTableBodyResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.RevenueTableTableFootResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.TimeRangeResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapper;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.RestaurantRepository;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity;
import vn.tuhoc.vinaeatery.modules.table.repositories.TableRepository;
import vn.tuhoc.vinaeatery.utils.TimeRangeUtil;

@Service
@RequiredArgsConstructor
public class RevenueService {
        private final RestaurantRepository restaurantRepository;
        private final UseTableRepository useTableRepository;
        private final BillRepository billRepository;
        private final TableRepository tableRepository;
        private final RestaurantMapper restaurantMapper;

        private RevenueResponseDTO handleDashboardTypeBill(RevenueRequestDTO revenueRequestDTO) {
                int restaurantId = revenueRequestDTO.getRestaurantId();

                //
                List<String> barXAxis = new ArrayList<>();
                List<Long> barSeries = new ArrayList<>();
                List<RevenueBillTableBodyResponseDTO> tableBody = new ArrayList<>();
                //
                List<TimeRangeResponseDTO> timeRangeResponseDTOs = TimeRangeUtil.getTimeRanges(
                                revenueRequestDTO.getTimeline(),
                                revenueRequestDTO.getTimeDetail());
                //
                List<BillEntity> billsInTimeRange = this.billRepository
                                .findAllWithDetailsInTimeRange(
                                                restaurantId,
                                                timeRangeResponseDTOs.get(0).getStart(),
                                                timeRangeResponseDTOs
                                                                .get(timeRangeResponseDTOs.size() - 1)
                                                                .getEnd());
                //
                int billIndex = 0;
                for (TimeRangeResponseDTO timeRangeResponseDTO : timeRangeResponseDTOs) {
                        String label = timeRangeResponseDTO.getLabel();
                        String start = timeRangeResponseDTO.getStart();
                        String end = timeRangeResponseDTO.getEnd();

                        int bill = 0;
                        long quantity = 0;
                        long revenue = 0;
                        while (billIndex < billsInTimeRange.size()) {
                                BillEntity billEntity = billsInTimeRange.get(billIndex);

                                String billCreateAt = billEntity.getCreateAt();
                                if (billCreateAt.compareTo(start) < 0) {
                                        billIndex++;
                                        continue;
                                }
                                if (billCreateAt.compareTo(end) > 0) {
                                        break;
                                }

                                bill++;
                                quantity += billEntity.getBillDetails()
                                                .stream()
                                                .mapToLong(BillDetailEntity::getQuantity)
                                                .sum();
                                revenue += billEntity.getTotalPrice();
                                billIndex++;
                        }

                        RevenueBillTableBodyResponseDTO revenueBillTableBodyResponseDTO = RevenueBillTableBodyResponseDTO
                                        .builder()
                                        .label(label)
                                        .start(start)
                                        .end(end)
                                        .bill(bill)
                                        .quantity(quantity)
                                        .revenue(revenue)
                                        .build();

                        barXAxis.add(label.replace(
                                        revenueRequestDTO.getTimeline().equals(TimelineEnum.YEAR) ? "áng " : "ần ",
                                        ""));
                        barSeries.add(revenue);
                        tableBody.add(revenueBillTableBodyResponseDTO);
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
                RevenueBarChartResponseDTO barChart = RevenueBarChartResponseDTO.builder()
                                .xAxis(barXAxis)
                                .series(barSeries)
                                .build();
                RevenueBillTableFootResponseDTO tableFoot = RevenueBillTableFootResponseDTO.builder()
                                .totalBill(tableBody.stream()
                                                .mapToLong(RevenueBillTableBodyResponseDTO::getBill).sum())
                                .totalQuantity(tableBody.stream()
                                                .mapToLong(RevenueBillTableBodyResponseDTO::getQuantity).sum())
                                .totalRevenue(tableBody.stream()
                                                .mapToLong(RevenueBillTableBodyResponseDTO::getRevenue).sum())
                                .build();

                RevenueCardResponseDTO card = RevenueCardResponseDTO.builder()
                                .total(cardTotal)
                                .average(cardAverage)
                                .max(cardMax)
                                .min(cardMin)
                                .build();
                RevenueChartResponseDTO chart = RevenueChartResponseDTO.builder()
                                .bar(barChart)
                                .build();
                RevenueTableResponseDTO table = RevenueTableResponseDTO.builder()
                                .billTableBody(tableBody)
                                .billTableFoot(tableFoot)
                                .build();

                return RevenueResponseDTO.builder()
                                .dateStart(tableBody.get(0).getStart())
                                .dateEnd(tableBody.get(tableBody.size() - 1).getEnd())
                                .card(card)
                                .chart(chart)
                                .table(table)
                                .build();
        }

        private RevenueResponseDTO handleDashboardTypeFood(RevenueRequestDTO revenueRequestDTO) {
                int restaurantId = revenueRequestDTO.getRestaurantId();

                //
                List<PieChartResponseDTO> data = new ArrayList<>();
                List<RevenueFoodTableBodyResponseDTO> tableBody = new ArrayList<>();
                //
                List<TimeRangeResponseDTO> timeRangeResponseDTOs = TimeRangeUtil.getTimeRanges(
                                revenueRequestDTO.getTimeline(),
                                revenueRequestDTO.getTimeDetail());
                //
                List<BillEntity> billWithDetailsInTimeRange = this.billRepository
                                .findAllWithDetailsInTimeRange(
                                                restaurantId,
                                                timeRangeResponseDTOs.get(0).getStart(),
                                                timeRangeResponseDTOs
                                                                .get(timeRangeResponseDTOs.size() - 1)
                                                                .getEnd());
                List<BillDetailEntity> billDetailEntities = billWithDetailsInTimeRange.stream()
                                .flatMap(billEntity -> billEntity.getBillDetails().stream())
                                .sorted(Comparator
                                                .comparing(BillDetailEntity::getFoodNameSnapshot,
                                                                String.CASE_INSENSITIVE_ORDER)
                                                .thenComparing(BillDetailEntity::getFoodPriceSnapshot))
                                .toList();
                //
                Set<Integer> existsNameAndPrice = new HashSet<>();
                Set<Integer> existsName = new HashSet<>();
                for (int i = 0; i < billDetailEntities.size(); i++) {
                        if (existsNameAndPrice.contains(i)) {
                                continue;
                        }

                        String currentName = billDetailEntities.get(i).getFoodNameSnapshot();
                        long currentPrice = billDetailEntities.get(i).getPrice();
                        long currentQuantity = billDetailEntities.get(i).getQuantity();
                        long currentRevenue = billDetailEntities.get(i).getTotalPriceDetail();
                        int rowSpan = 1;

                        Set<Long> differentPrices = new HashSet<>();
                        differentPrices.add(currentPrice);

                        int j = i + 1;
                        while (j < billDetailEntities.size()
                                        && currentName.equalsIgnoreCase(
                                                        billDetailEntities.get(j).getFoodNameSnapshot())) {
                                BillDetailEntity billDetailEntityNext = billDetailEntities.get(j);
                                if (currentPrice == billDetailEntityNext.getPrice()) {
                                        currentQuantity += billDetailEntityNext.getQuantity();
                                        currentRevenue += billDetailEntityNext.getTotalPriceDetail();

                                        existsNameAndPrice.add(j);
                                        j++;

                                        continue;
                                } else {
                                        differentPrices.add(billDetailEntityNext.getPrice());
                                }

                                existsName.add(j);
                                j++;
                        }
                        rowSpan = differentPrices.size();

                        PieChartResponseDTO pieChartResponseDTO = PieChartResponseDTO.builder()
                                        .id(billDetailEntities.get(i).getId().getFoodId())
                                        .label(currentName)
                                        .value(currentRevenue)
                                        .build();
                        RevenueFoodTableBodyResponseDTO revenueFoodTableBodyResponseDTO = RevenueFoodTableBodyResponseDTO
                                        .builder()
                                        .name(currentName)
                                        .price(currentPrice)
                                        .quantity(currentQuantity)
                                        .revenue(currentRevenue)
                                        .rowSpan(existsName.contains(i) ? 0 : rowSpan)
                                        .build();

                        data.add(pieChartResponseDTO);
                        tableBody.add(revenueFoodTableBodyResponseDTO);
                }
                //
                long cardTotal = tableBody.stream()
                                .mapToLong(RevenueFoodTableBodyResponseDTO::getRevenue)
                                .sum();
                double cardAverage = tableBody.stream()
                                .mapToLong(RevenueFoodTableBodyResponseDTO::getRevenue)
                                .average()
                                .orElse(0D);
                long cardMax = tableBody.stream()
                                .mapToLong(RevenueFoodTableBodyResponseDTO::getRevenue)
                                .max()
                                .orElse(0L);
                long cardMin = tableBody.stream()
                                .mapToLong(RevenueFoodTableBodyResponseDTO::getRevenue)
                                .min()
                                .orElse(0L);
                RevenuePieChartResponseDTO pieChart = RevenuePieChartResponseDTO.builder()
                                .data(data)
                                .build();
                RevenueFoodTableFootResponseDTO tableFoot = RevenueFoodTableFootResponseDTO
                                .builder()
                                .totalQuantity(tableBody.stream()
                                                .mapToLong(RevenueFoodTableBodyResponseDTO::getQuantity).sum())
                                .totalRevenue(tableBody.stream()
                                                .mapToLong(RevenueFoodTableBodyResponseDTO::getRevenue).sum())
                                .build();

                RevenueCardResponseDTO card = RevenueCardResponseDTO.builder()
                                .total(cardTotal)
                                .average(cardAverage)
                                .max(cardMax)
                                .min(cardMin)
                                .build();
                RevenueChartResponseDTO chart = RevenueChartResponseDTO.builder()
                                .pie(pieChart)
                                .build();
                RevenueTableResponseDTO table = RevenueTableResponseDTO.builder()
                                .foodTableBody(tableBody)
                                .foodTableFoot(tableFoot)
                                .build();

                return RevenueResponseDTO.builder()
                                .dateStart(timeRangeResponseDTOs.get(0).getStart())
                                .dateEnd(timeRangeResponseDTOs.get(timeRangeResponseDTOs.size() - 1).getEnd())
                                .card(card)
                                .chart(chart)
                                .table(table)
                                .build();
        }

        private RevenueResponseDTO handleDashboardTypeTable(RevenueRequestDTO revenueRequestDTO) {
                int restaurantId = revenueRequestDTO.getRestaurantId();

                //
                List<PieChartResponseDTO> data = new ArrayList<>();
                List<RevenueTableTableBodyResponseDTO> tableBody = new ArrayList<>();
                //
                List<TimeRangeResponseDTO> timeRangeResponseDTOs = TimeRangeUtil.getTimeRanges(
                                revenueRequestDTO.getTimeline(),
                                revenueRequestDTO.getTimeDetail());
                //
                List<UseTableEntity> useTablesInTimeRange = this.useTableRepository.findAllInTimeRange(
                                restaurantId,
                                timeRangeResponseDTOs.get(0).getStart(),
                                timeRangeResponseDTOs
                                                .get(timeRangeResponseDTOs.size() - 1)
                                                .getEnd());
                List<TableEntity> tables = this.tableRepository.findAllByRestaurantId(restaurantId);
                //
                int useTableIndex = 0;
                for (TableEntity tableEntity : tables) {
                        String tableName = tableEntity.getName();

                        int bill = 0;
                        long quantity = 0;
                        long revenue = 0;

                        while (useTableIndex < useTablesInTimeRange.size()) {
                                UseTableEntity useTableEntity = useTablesInTimeRange.get(useTableIndex);

                                if (tableEntity.getId().equals(useTableEntity.getTable().getId())) {
                                        BillEntity billEntity = useTableEntity.getBill();

                                        bill++;
                                        quantity += billEntity.getBillDetails()
                                                        .stream()
                                                        .mapToLong(BillDetailEntity::getQuantity)
                                                        .sum();
                                        revenue += billEntity.getTotalPrice();
                                        useTableIndex++;
                                } else {
                                        break;
                                }
                        }

                        PieChartResponseDTO pieChartResponseDTO = PieChartResponseDTO.builder()
                                        .id(tableEntity.getId())
                                        .label(tableName)
                                        .value(revenue)
                                        .build();
                        RevenueTableTableBodyResponseDTO revenueTableTableBodyResponseDTO = RevenueTableTableBodyResponseDTO
                                        .builder()
                                        .tableName(tableName)
                                        .bill(bill)
                                        .quantity(quantity)
                                        .revenue(revenue)
                                        .build();

                        data.add(pieChartResponseDTO);
                        tableBody.add(revenueTableTableBodyResponseDTO);
                }
                //
                long cardTotal = tableBody.stream()
                                .mapToLong(RevenueTableTableBodyResponseDTO::getRevenue)
                                .sum();
                double cardAverage = tableBody.stream()
                                .mapToLong(RevenueTableTableBodyResponseDTO::getRevenue)
                                .average()
                                .orElse(0D);
                long cardMax = tableBody.stream()
                                .mapToLong(RevenueTableTableBodyResponseDTO::getRevenue)
                                .max()
                                .orElse(0L);
                long cardMin = tableBody.stream()
                                .mapToLong(RevenueTableTableBodyResponseDTO::getRevenue)
                                .min()
                                .orElse(0L);
                RevenuePieChartResponseDTO pieChart = RevenuePieChartResponseDTO.builder()
                                .data(data)
                                .build();
                RevenueTableTableFootResponseDTO tableFoot = RevenueTableTableFootResponseDTO
                                .builder()
                                .totalBill(tableBody.stream()
                                                .mapToLong(RevenueTableTableBodyResponseDTO::getBill).sum())
                                .totalQuantity(tableBody.stream()
                                                .mapToLong(RevenueTableTableBodyResponseDTO::getQuantity).sum())
                                .totalRevenue(tableBody.stream()
                                                .mapToLong(RevenueTableTableBodyResponseDTO::getRevenue).sum())
                                .build();

                RevenueCardResponseDTO card = RevenueCardResponseDTO.builder()
                                .total(cardTotal)
                                .average(cardAverage)
                                .max(cardMax)
                                .min(cardMin)
                                .build();
                RevenueChartResponseDTO chart = RevenueChartResponseDTO.builder()
                                .pie(pieChart)
                                .build();
                RevenueTableResponseDTO table = RevenueTableResponseDTO.builder()
                                .tableTableBody(tableBody)
                                .tableTableFoot(tableFoot)
                                .build();

                return RevenueResponseDTO.builder()
                                .dateStart(timeRangeResponseDTOs.get(0).getStart())
                                .dateEnd(timeRangeResponseDTOs.get(timeRangeResponseDTOs.size() - 1).getEnd())
                                .card(card)
                                .chart(chart)
                                .table(table)
                                .build();
        }

        @Cacheable(value = "dashboard__revenue", key = "'restaurantId=' + #revenueRequestDTO.getRestaurantId() + 'type=' + #revenueRequestDTO.getType() + 'timeline=' + #revenueRequestDTO.getTimeline() + 'timeDetail=' + #revenueRequestDTO.getTimeDetail()", unless = "#result == null")
        public RevenueResponseDTO handleDashboard(RevenueRequestDTO revenueRequestDTO) {
                RevenueTypeEnum type = revenueRequestDTO.getType();

                RevenueResponseDTO revenueResponseDTO = null;
                if (type.equals(RevenueTypeEnum.BILL)) {
                        revenueResponseDTO = this.handleDashboardTypeBill(revenueRequestDTO);
                } else if (type.equals(RevenueTypeEnum.FOOD)) {
                        revenueResponseDTO = this.handleDashboardTypeFood(revenueRequestDTO);
                } else if (type.equals(RevenueTypeEnum.TABLE)) {
                        revenueResponseDTO = this.handleDashboardTypeTable(revenueRequestDTO);
                }

                RestaurantSubInfoResponseDTO restaurant = this.restaurantMapper
                                .entityToSubInfoResponse(
                                                this.restaurantRepository
                                                                .findOneByIdToCrud(revenueRequestDTO.getRestaurantId())
                                                                .get());
                revenueResponseDTO.setRestaurant(restaurant);

                return revenueResponseDTO;
        }
}
