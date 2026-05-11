import { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useTheme } from '@/shared/contexts/ThemeContext';
import type { CategoryWiseExpensesData } from '@/types/api/reports/reports';
import {
  categoryColorList,
  categoryGradientStops,
} from '../lib/categoryColors';
import DonutChartLoader from './loaders/DonutChartLoader';

type Props = {
  totalExpenses: number;
  data?: CategoryWiseExpensesData;
  isLoading: boolean;
};

// Pie/donut chart of category-wise expenses for the selected month. Drawing
// logic untouched from the legacy component; the gradient/colour map moved
// to features/dashboard/lib/categoryColors.ts to deduplicate it.
export default function CategoryDonutChart({ totalExpenses, data, isLoading }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  const valuesByCategory = mapToCategoryValues(data);
  const total = valuesByCategory.reduce((acc, c) => acc + c.value, 0);

  useLayoutEffect(() => {
    if (!chartRef.current) return;
    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.horizontalLayout,
        innerRadius: am5.percent(65),
      }),
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        alignLabels: false,
      }),
    );

    series.set(
      'colors',
      am5.ColorSet.new(root, {
        colors: categoryColorList.map((c) => am5.color(c.hex)),
      }),
    );

    series.slices.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(isDarkMode ? 0x000000 : 0xffffff),
      cornerRadius: 5,
    });

    series.slices.template.adapters.add('fillGradient', (fill, target) => {
      const ctx = target.dataItem?.dataContext as { category?: string };
      if (!ctx?.category) return fill;
      const stops = categoryGradientStops[ctx.category];
      if (!stops) return fill;
      return am5.LinearGradient.new(root, {
        stops: stops.map((c) => ({ color: am5.color(c) })),
      });
    });

    series.data.setAll(valuesByCategory);
    series.labels.template.set('forceHidden', true);
    series.ticks.template.set('forceHidden', true);

    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: `Expense\n${totalExpenses}`,
        textAlign: 'center',
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Karla',
        fill: am5.color(isDarkMode ? 0xffffff : 0x000000),
      }),
    );

    series.appear(1000, 100);
    return () => root.dispose();
  }, [isDarkMode, totalExpenses, data]);

  return (
    <div
      id="donut_chart_category_expense_section"
      className="flex w-full max-w-full flex-col items-center rounded-lg border border-border_light bg-bg_primary_light p-0 py-4 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark md:p-4"
    >
      <h2 className="mb-4 text-center text-lg font-semibold md:text-left">
        Category wise Expenses Visualization
      </h2>
      {isLoading && <DonutChartLoader />}
      <div
        className={`chart_element_container ${isLoading ? 'hidden' : 'flex'} w-full flex-col items-center justify-center gap-4 sm:flex-row`}
      >
        <div ref={chartRef} className="h-52 w-52" style={{ maxWidth: '400px' }} />
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:flex-col sm:items-start sm:justify-start">
          {valuesByCategory.map(({ category, value }) => {
            if (value === 0) return null;
            const palette = categoryColorList.find((c) => c.category === category);
            const pct = total > 0 ? (value / total) * 100 : 0;
            const display = pct.toFixed(0) === '0' ? pct.toFixed(1) : pct.toFixed(0);
            return (
              <div key={category} className="flex items-center space-x-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-sm p-0.5 text-sm font-semibold text-white"
                  style={{ background: palette?.gradient }}
                >
                  {display}%
                </div>
                <span>{category}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Translate the server's CategoryWiseExpensesData (one numeric field per
// category) into the array shape the chart expects.
function mapToCategoryValues(data?: CategoryWiseExpensesData) {
  const lookup: Record<string, number> = {
    Groceries: data?.GroceriesExpenses ?? 0,
    'Housing & Utilities': data?.Housing_UtilitiesExpenses ?? 0,
    Medical: data?.MedicalExpenses ?? 0,
    Food: data?.FoodExpenses ?? 0,
    Personal: data?.PersonalExpenses ?? 0,
    Educational: data?.EducationalExpenses ?? 0,
    Transportation: data?.TransportationExpenses ?? 0,
    Miscellaneous: data?.MiscellaneousExpenses ?? 0,
  };
  return categoryColorList.map((c) => ({ category: c.category, value: lookup[c.category] }));
}
