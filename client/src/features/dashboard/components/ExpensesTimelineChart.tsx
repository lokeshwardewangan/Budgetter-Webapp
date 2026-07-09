import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useTheme } from '@/shared/contexts/ThemeContext';
import ChartFilterOptions from '@/shared/components/charts/ChartFilterOptions';
import { getMonthInNumber } from '@/utils/date/date';
import { useAllExpenses } from '@/features/expenses/hooks';
import type { Expense } from '@/types/api/expenses/expenses';
import LineChartLoader from './loaders/LineChartLoader';

type ChartFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';
type Point = { day: string; value: number };

type Props = {
  monthLabel: string;
  yearLabel: string;
};

export default function ExpensesTimelineChart({
  monthLabel,
  yearLabel,
}: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState<ChartFilter>('daily');

  const { data: allExpenses = [], isLoading } = useAllExpenses();

  const chartData = useMemo(
    () => computeSeries(allExpenses, filter, monthLabel, yearLabel),
    [allExpenses, filter, monthLabel, yearLabel]
  );

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
      })
    );
    chart
      .set('cursor', am5xy.XYCursor.new(root, { behavior: 'none' }))
      .lineY.set('visible', false);

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'day',
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis.get('renderer').labels.template.setAll({
      fontSize: 10,
      fontWeight: '500',
      fill: am5.color(isDarkMode ? 0xffffff : 0x000000),
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) })
    );
    yAxis.get('renderer').labels.template.setAll({
      fontSize: 10,
      fontWeight: '500',
      fill: am5.color(isDarkMode ? 0xffffff : 0x000000),
    });

    const gridColor = am5.color(isDarkMode ? 0x666666 : 0xd9d8d8);
    xAxis
      .get('renderer')
      .grid.template.setAll({ stroke: gridColor, strokeOpacity: 0.5 });
    yAxis
      .get('renderer')
      .grid.template.setAll({ stroke: gridColor, strokeOpacity: 0.5 });

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
      })
    );
    series.strokes.template.setAll({ strokeWidth: 3 });
    series.fills.template.setAll({ visible: true, fillOpacity: 0.2 });
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, { radius: 5, fill: series.get('stroke') }),
      })
    );

    xAxis.data.setAll(chartData);
    series.data.setAll(chartData);
    series.appear(1000);
    chart.appear(1000, 100);

    const updateLabels = () => {
      if (window.innerWidth < 500) {
        xAxis
          .get('renderer')
          .labels.template.adapters.add('text', (text, target) => {
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

  const chartTitle = useMemo(() => {
    switch (filter) {
      case 'daily':
        return `Daily Spend - ${monthLabel} ${yearLabel}`;
      case 'weekly':
        return `Weekly Spend - ${monthLabel} ${yearLabel}`;
      case 'monthly':
        return `6-Month Trend (up to ${monthLabel} ${yearLabel})`;
      case 'yearly':
        return `3-Year Trend (up to ${yearLabel})`;
    }
  }, [filter, monthLabel, yearLabel]);

  return (
    <div
      id="interval_time_expense_insight_section"
      className="flex w-full max-w-full flex-col items-center rounded-lg border border-border_light bg-bg_primary_light p-0 py-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark md:p-4"
    >
      <div className="heading_part_chart relative flex w-full items-center justify-between px-4 sm:px-2">
        <h2 className="text-left text-base font-semibold text-text_primary_light dark:text-text_primary_dark">
          {chartTitle}
        </h2>
        <ChartFilterOptions setChartFilter={setFilter} />
      </div>
      <div className="chart_element_container flex h-full w-full flex-col items-center justify-center px-2">
        {isLoading ? (
          <LineChartLoader />
        ) : (
          <div
            ref={chartRef}
            className="h-[230px] w-full"
            style={{ maxWidth: '100%' }}
          />
        )}
      </div>
    </div>
  );
}

function computeSeries(
  allExpenses: Expense[],
  filter: ChartFilter,
  monthLabel: string,
  yearLabel: string
): Point[] {
  const monthNum = getMonthInNumber(monthLabel);

  if (filter === 'daily') {
    const daysInMonth = new Date(
      Number(yearLabel),
      Number(monthNum),
      0
    ).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dayStr = String(day).padStart(2, '0');
      const val = allExpenses
        .filter((e) => {
          const d = new Date(e.date);
          const m = String(d.getUTCMonth() + 1).padStart(2, '0');
          const y = String(d.getUTCFullYear());
          const dayVal = String(d.getUTCDate()).padStart(2, '0');
          return m === monthNum && y === yearLabel && dayVal === dayStr;
        })
        .reduce((sum, e) => sum + (e.price ?? 0), 0);
      return { day: dayStr, value: val };
    });
  }

  if (filter === 'weekly') {
    const weeks = [
      { day: 'Week 1', value: 0 },
      { day: 'Week 2', value: 0 },
      { day: 'Week 3', value: 0 },
      { day: 'Week 4', value: 0 },
      { day: 'Week 5', value: 0 },
    ];
    for (const e of allExpenses) {
      const d = new Date(e.date);
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const y = String(d.getUTCFullYear());
      if (m !== monthNum || y !== yearLabel) continue;
      const day = d.getUTCDate();
      const idx = Math.min(Math.floor((day - 1) / 7), 4);
      weeks[idx].value += e.price ?? 0;
    }
    if (weeks[4].value === 0) {
      weeks.pop();
    }
    return weeks;
  }

  if (filter === 'monthly') {
    const trendMonths: { mNum: string; yStr: string; label: string }[] = [];
    let curM = Number(monthNum);
    let curY = Number(yearLabel);
    for (let i = 5; i >= 0; i--) {
      let targetM = curM - i;
      let targetY = curY;
      while (targetM <= 0) {
        targetM += 12;
        targetY -= 1;
      }
      const monthNameShort = new Date(targetY, targetM - 1).toLocaleString(
        'default',
        {
          month: 'short',
        }
      );
      trendMonths.push({
        mNum: String(targetM).padStart(2, '0'),
        yStr: String(targetY),
        label: `${monthNameShort} ${targetY}`,
      });
    }
    return trendMonths.map(({ mNum, yStr, label }) => {
      const val = allExpenses
        .filter((e) => {
          const d = new Date(e.date);
          const m = String(d.getUTCMonth() + 1).padStart(2, '0');
          const y = String(d.getUTCFullYear());
          return m === mNum && y === yStr;
        })
        .reduce((sum, e) => sum + (e.price ?? 0), 0);
      return { day: label, value: val };
    });
  }

  // yearly
  const currentYearNum = Number(yearLabel);
  const years = [currentYearNum - 2, currentYearNum - 1, currentYearNum];
  return years.map((y) => {
    const yStr = String(y);
    const val = allExpenses
      .filter((e) => {
        const d = new Date(e.date);
        const yVal = String(d.getUTCFullYear());
        return yVal === yStr;
      })
      .reduce((sum, e) => sum + (e.price ?? 0), 0);
    return { day: yStr, value: val };
  });
}
