import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useTheme } from '@/shared/contexts/ThemeContext';
import ChartFilterOptions from '@/shared/components/charts/ChartFilterOptions';
import { getDayName, getLast7Dates } from '@/utils/date/date';
import { useAllExpenses } from '@/features/expenses/hooks';
import type { ExpenseEntry } from '@/types/api/expenses/expenses';
import LineChartLoader from './loaders/LineChartLoader';

type ChartFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';
type Point = { day: string; value: number };

export default function ExpensesTimelineChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState<ChartFilter>('daily');

  // Sourced from the shared all-expenses query — same data the insights table
  // reads, so there's only one network call between them.
  const { data: allExpenses = [], isLoading } = useAllExpenses();

  const chartData = useMemo(() => computeSeries(allExpenses, filter), [allExpenses, filter]);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
      }),
    );
    chart.set('cursor', am5xy.XYCursor.new(root, { behavior: 'none' })).lineY.set(
      'visible',
      false,
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'day',
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
        tooltip: am5.Tooltip.new(root, {}),
      }),
    );
    xAxis.get('renderer').labels.template.setAll({
      fontSize: 10,
      fontWeight: '500',
      fill: am5.color(isDarkMode ? 0xffffff : 0x000000),
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }),
    );
    yAxis.get('renderer').labels.template.setAll({
      fontSize: 10,
      fontWeight: '500',
      fill: am5.color(isDarkMode ? 0xffffff : 0x000000),
    });

    const gridColor = am5.color(isDarkMode ? 0x666666 : 0xd9d8d8);
    xAxis.get('renderer').grid.template.setAll({ stroke: gridColor, strokeOpacity: 0.5 });
    yAxis.get('renderer').grid.template.setAll({ stroke: gridColor, strokeOpacity: 0.5 });

    const series = chart.series.push(
      am5xy.StepLineSeries.new(root, {
        name: 'Expenses',
        xAxis,
        yAxis,
        valueYField: 'value',
        categoryXField: 'day',
        tooltip: am5.Tooltip.new(root, { labelText: '₹{valueY}' }),
        stroke: am5.color(0x6794dc),
        fill: am5.color(0x6794dc),
      }),
    );
    series.strokes.template.setAll({ strokeWidth: 3 });
    series.fills.template.setAll({ visible: true, fillOpacity: 0.2 });
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, { radius: 5, fill: series.get('stroke') }),
      }),
    );

    xAxis.data.setAll(chartData);
    series.data.setAll(chartData);
    series.appear(1000);
    chart.appear(1000, 100);

    const updateLabels = () => {
      if (window.innerWidth < 500) {
        xAxis.get('renderer').labels.template.adapters.add('text', (text, target) => {
          const category = target.dataItem?.get('category' as any);
          return category ? category[0] : text;
        });
      } else {
        xAxis.get('renderer').labels.template.adapters.remove('text');
      }
    };
    updateLabels();
    window.addEventListener('resize', updateLabels);

    return () => {
      root.dispose();
      window.removeEventListener('resize', updateLabels);
    };
  }, [isDarkMode, chartData]);

  // Force re-render on filter change so amCharts picks up new data.
  useEffect(() => {}, [filter]);

  return (
    <div
      id="interval_time_expense_insight_section"
      className="flex w-full max-w-full flex-col items-center rounded-lg border border-border_light bg-bg_primary_light p-0 py-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark md:p-4"
    >
      <div className="heading_part_chart relative flex w-full items-center justify-center">
        <h2 className="mb-4 text-left text-lg font-semibold">Expenses Details</h2>
        <ChartFilterOptions setChartFilter={setFilter} />
      </div>
      <div className="chart_element_container flex h-full w-full flex-col items-center justify-center">
        {isLoading ? (
          <LineChartLoader />
        ) : (
          <div
            ref={chartRef}
            className="h-[250px] w-full lg:h-full"
            style={{ maxWidth: '100%' }}
          />
        )}
      </div>
    </div>
  );
}

// Build the X-axis series for the chosen filter from the full expense list.
function computeSeries(allExpenses: ExpenseEntry[], filter: ChartFilter): Point[] {
  const sumOf = (entries: ExpenseEntry[]) =>
    entries.reduce(
      (acc, e) => acc + e.products.reduce((s, p) => s + (p.price ?? 0), 0),
      0,
    );

  if (filter === 'daily') {
    return getLast7Dates.map((day) => ({
      day: getDayName(day),
      value: sumOf(allExpenses.filter((e) => e.date === day)),
    }));
  }

  if (filter === 'weekly') {
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentYear = String(now.getFullYear());
    const weeks = [
      { day: 'Week-1', value: 0 },
      { day: 'Week-2', value: 0 },
      { day: 'Week-3', value: 0 },
      { day: 'Week-4', value: 0 },
    ];
    for (const e of allExpenses) {
      const [d, m, y] = e.date.split('-');
      if (m !== currentMonth || y !== currentYear) continue;
      const idx = Math.min(Math.floor((parseInt(d) - 1) / 7), 3);
      weeks[idx].value += e.products.reduce((s, p) => s + (p.price ?? 0), 0);
    }
    return weeks;
  }

  if (filter === 'monthly') {
    const byMonth = new Map<string, number>();
    for (const e of allExpenses) {
      const [, m, y] = e.date.split('-');
      const key = `${m}-${y}`;
      byMonth.set(
        key,
        (byMonth.get(key) ?? 0) + e.products.reduce((s, p) => s + (p.price ?? 0), 0),
      );
    }
    return Array.from(byMonth, ([day, value]) => ({ day, value }));
  }

  // yearly
  const byYear = new Map<string, number>();
  for (const e of allExpenses) {
    const [, , y] = e.date.split('-');
    byYear.set(
      y,
      (byYear.get(y) ?? 0) + e.products.reduce((s, p) => s + (p.price ?? 0), 0),
    );
  }
  return Array.from(byYear, ([day, value]) => ({ day, value }));
}
