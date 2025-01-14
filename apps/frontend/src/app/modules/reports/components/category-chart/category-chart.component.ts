import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { IReport } from '../../../shared/models/report';
import {
  IScenario,
  ReportsRegistryService,
  ScenariosRegistryService,
} from '../../../shared/public-api';
import { getStatusReport, IStatusReport } from '../helpers/results';

@Component({
  selector: 'scenarii-category-chart',
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.css'],
})
export class CategoryChartComponent {
  public chartType: ChartType = 'bar';
  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };
  public chartOptions: ChartOptions = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  constructor(
    scenarios: ScenariosRegistryService,
    private reports: ReportsRegistryService
  ) {
    const categories = scenarios.getAllByCategories();

    this.chartData.datasets = this.getCategoryStatuses(categories);
    this.chartData.labels = this.removeEmptyCategory(Object.keys(categories));
  }

  private removeEmptyCategory(categories: string[]): string[] {
    // Replace empty label by a default label
    const emptyIdx = categories.indexOf('');
    if (emptyIdx > -1) {
      categories[emptyIdx] = 'No category';
    }

    return categories;
  }

  private getCategoryStatuses(categories: {
    [category: string]: IScenario[];
  }): IStatusReport {
    return Object.keys(categories).reduce(
      (acc, category, index) => {
        const categoryStatus = this.getCategoryStatus(categories[category]);

        acc.map(
          (state, stateIndex) =>
            (state.data[index] = categoryStatus[stateIndex].data[0])
        );
        return acc;
      },
      [
        {
          label: 'Valid',
          data: [],
          backgroundColor: '#A3E635',
          hoverBackgroundColor: '#BEF264',
        },
        {
          label: 'Failed',
          data: [],
          backgroundColor: '#F87171',
          hoverBackgroundColor: '#FCA5A5',
        },
        {
          label: 'Pending',
          data: [],
          backgroundColor: '#FBBF24',
          hoverBackgroundColor: '#FCD34D',
        },
      ] as IStatusReport
    );
  }

  private getCategoryStatus(categoryScenarios: IScenario[]): IStatusReport {
    const categoryReports = categoryScenarios
      .map((scenario) => this.reports.get(scenario.id))
      .filter(
        (report): report is IReport & { index: number } => report !== undefined
      );

    return getStatusReport(categoryReports, categoryScenarios.length);
  }
}
