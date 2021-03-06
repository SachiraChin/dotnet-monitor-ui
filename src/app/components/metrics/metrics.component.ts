import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { ThemeService as ChartThemeService } from 'ng2-charts';
import { Options } from '@m0t0r/ngx-slider';
import { MetricModel } from 'src/app/models/metric-model';
import { MetricsService } from 'src/app/services/metrics-service';
import { getTimestampBasedFilename } from 'src/app/utilities/filename-extensions';
import { ThemeService } from '../../services/theme-service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
  form: FormGroup = new FormGroup({
    intervalSeconds: new FormControl(10),
  });
  chartFiltersForm: FormGroup = new FormGroup({
    displayGraphs: new FormControl([]),
  });

  lineChartData: ChartDataSets[] = [];
  lineChartLabels: any[] = [];
  lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{
        type: 'time',
        distribution: 'linear',
        time: {
          displayFormats: {
            second: 'h:mm:ss a'
          },
          stepSize: 2
        }
      }],
      yAxes: [
        {
          id: 'y-axis-left',
          position: 'left',
          ticks: {
            suggestedMin: 0,
          }
        },
        {
          id: 'y-axis-right',
          position: 'right',
          ticks: {
            suggestedMin: 0,
          }
          // gridLines: {
          //   color: 'rgba(255,0,0,0.3)',
          // },
          // ticks: {
          //   fontColor: 'red',
          // }
        }
      ]
    },
    annotation: {
      // annotations: [
      //   {
      //     type: 'line',
      //     mode: 'vertical',
      //     scaleID: 'x-axis-0',
      //     value: 'March',
      //     borderColor: 'orange',
      //     borderWidth: 2,
      //     label: {
      //       enabled: true,
      //       fontColor: 'orange',
      //       content: 'LineAnno'
      //     },
      //     responsive: true,
      //     maintainAspectRatio: false,
      //   },
      // ],
    },
  };
  lineChartPlugins = [];
  sliderOptions: Options = {
    floor: 0,
    ceil: 1,
    step: 1,
    animate: true,
    translate: (value: number): string => {
      return new Date(value * 1000).toLocaleTimeString();
    },
    draggableRange: true,
    stepsArray: []
  };

  metricsList: { name: string; displayName: string; }[] = [];
  metricsLoadTimerPointer: number;
  data: { [key: string]: MetricModel; } = {};
  chartMetricIndex: { [key: string]: number; };
  minSelected = 0;
  maxSelected = 1;
  lastUpdatedTimestamp = 0;
  staticMetricsToBeSelected = ['microsoftaspnetcorehosting_requests_per_second', 'microsoftaspnetcorehosting_total_requests', 'microsoftaspnetcorehosting_current_requests', 'microsoftaspnetcorehosting_failed_requests', 'systemruntime_alloc_rate_bytes'];
  availableTimestamps = [];
  isSliderMinIsMinTimestamp = true;
  isSliderMaxIsMaxTimestamp = true;
  showNoMetricsWarning = false;
  metricsTrackerRunning = false;

  get downloadAvailable(): boolean {
    return Object.keys(this.data).length > 0;
  }

  constructor(private metricsService: MetricsService, private chartThemeService: ChartThemeService, private themeService: ThemeService) {
    // BaseChartDirective.registerPlugin(colorSchemes);
    this.loadMetrics = this.loadMetrics.bind(this);
  }

  async ngOnInit(): Promise<void> {
    // await this.reload();
    this.chartFiltersForm.get('displayGraphs').valueChanges.subscribe(() => {
      this.resetChart();
      this.updateGraphData();
    });
    this.themeService.onThemeChange.subscribe((theme) => {
      this.setChartTheme(theme);
    });
  }

  async reload(): Promise<void> {
    try {
      this.form.disable();
      this.chartFiltersForm.disable();

      const metrics = await this.metricsService.getMetrics();
      this.metricsList = Object.values(metrics).map(e => ({ name: e.metricName, displayName: e.metricDisplayName }));
      if (this.metricsList.map(e => e.name).some(e => this.staticMetricsToBeSelected.includes(e))) {
        this.chartFiltersForm.get('displayGraphs').setValue(this.staticMetricsToBeSelected);
      } else {
        const selectedMetrics = this.metricsList.slice(0, 6).map(e => e.name);
        this.chartFiltersForm.get('displayGraphs').setValue(selectedMetrics);
      }
      this.form.enable();
      this.chartFiltersForm.enable();
    } catch (error) {
      throw error;
    }
  }

  async start(): Promise<void> {
    this.resetChart();
    await this.loadMetrics();
    this.metricsLoadTimerPointer = setInterval(this.loadMetrics, +this.form.get('intervalSeconds').value * 1000);
    this.metricsTrackerRunning = true;
  }

  setChartTheme(value: string): void {
    let overrides: ChartOptions;
    if (value === 'dark') {
      overrides = {
        legend: {
          labels: { fontColor: 'white' }
        },
        scales: {
          xAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }],
          yAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }]
        }
      };
    } else {
      overrides = {};
    }
    this.chartThemeService.setColorschemesOptions(overrides);
  }

  resetChart(): void {
    this.lineChartData = [];
    this.lineChartLabels = [];
    this.chartMetricIndex = {};
    this.lastUpdatedTimestamp = 0;
  }

  stop(): void {
    if (this.metricsLoadTimerPointer) {
      clearInterval(this.metricsLoadTimerPointer);
      this.metricsTrackerRunning = false;
    }
  }

  async loadMetrics(): Promise<void> {
    const metrics = await this.metricsService.getMetrics();
    if (Object.keys(metrics).length === 0) {
      this.showNoMetricsWarning = true;
      return;
    } else {
      this.showNoMetricsWarning = false;
    }

    this.metricsList = Object.values(metrics).map(e => ({ name: e.metricName, displayName: e.metricDisplayName }));
    for (const metric of Object.values(metrics)) {
      if (!this.data[metric.metricName]) {
        this.data[metric.metricName] = new MetricModel();
        this.data[metric.metricName].metricDisplayName = metric.metricDisplayName;
        this.data[metric.metricName].metricName = metric.metricName;
        this.data[metric.metricName].metricType = metric.metricType;
        this.data[metric.metricName].runningAverage = 0;
        this.data[metric.metricName].metricCount = 0;
        this.data[metric.metricName].metricValues = {};
        this.data[metric.metricName].maxTimestamp = 0;
        this.data[metric.metricName].minTimestamp = 0;
      }

      const currentMetric = this.data[metric.metricName];
      for (const metricValue of Object.values(metric.metricValues)) {
        const timestamp = metricValue.timestampReceivedInSeconds;
        if (!currentMetric.metricValues[timestamp]) {
          currentMetric.metricValues[timestamp] = metricValue;
          currentMetric.runningAverage =
            (currentMetric.runningAverage * currentMetric.metricCount + metricValue.value) / (currentMetric.metricCount + 1);
          currentMetric.metricCount++;
          if (currentMetric.maxTimestamp < timestamp) {
            currentMetric.maxTimestamp = timestamp;
          }
          if (currentMetric.minTimestamp === 0 || currentMetric.minTimestamp > timestamp) {
            currentMetric.minTimestamp = timestamp;
          }
        }
      }
    }

    this.updateChartRange();
    this.updateRangeSteps();
    this.updateGraphData();
  }

  onSliderChange(): void {
    this.isSliderMinIsMinTimestamp = this.sliderOptions.floor === +this.minSelected;
    this.isSliderMaxIsMaxTimestamp = this.sliderOptions.ceil === +this.maxSelected;
    this.resetChart();
    this.updateGraphData();
  }

  updateChartRange(): void {
    const selectedMetrics = this.chartFiltersForm.get('displayGraphs').value as string[];
    const minTimestamp = Math.min.apply(null, selectedMetrics.map(e => this.data[e].minTimestamp));
    const maxTimestamp = Math.max.apply(null, selectedMetrics.map(e => this.data[e].maxTimestamp));

    if (this.sliderOptions.floor !== minTimestamp || this.sliderOptions.ceil !== maxTimestamp) {
      const newOptions: Options = Object.assign({}, this.sliderOptions);
      newOptions.floor = minTimestamp;
      newOptions.ceil = maxTimestamp;
      this.sliderOptions = newOptions;

      if (this.isSliderMinIsMinTimestamp) {
        this.minSelected = minTimestamp;
      }

      if (this.isSliderMaxIsMaxTimestamp) {
        this.maxSelected = maxTimestamp;
      }
    }
  }

  updateRangeSteps(): void {
    const selectedMetrics = this.chartFiltersForm.get('displayGraphs').value as string[];
    const timestampArrays = selectedMetrics.map(e => Object.keys(this.data[e].metricValues));
    const merged: number[] = [].concat.apply([], timestampArrays);
    const filtered = merged.filter((value: number, index: number, self: number[]) => value >= this.sliderOptions.floor
      && value <= this.sliderOptions.ceil
      && self.indexOf(value) === index
    );
    const newOptions: Options = Object.assign({}, this.sliderOptions);
    newOptions.stepsArray = filtered.sort((a, b) => a - b).map(e => ({ value: e }));
    this.sliderOptions = newOptions;
  }

  updateGraphData(): void {
    if (!this.data || Object.keys(this.data).length === 0) {
      return;
    }

    const hasChartReset = this.lineChartData.length === 0;
    const selectedMetrics = this.chartFiltersForm.get('displayGraphs').value as string[];
    // const chartData: { [key: string]: ChartDataSets; } = {};
    if (hasChartReset) {
      for (const metricName of selectedMetrics) {
        const metric = this.data[metricName];
        if (!metric) {
          continue;
        }

        this.chartMetricIndex[metricName] = this.lineChartData.length;
        this.lineChartData.push({
          data: [],
          label: metric.metricDisplayName,
          spanGaps: true,
        });

      }

      const minSelectedTimestamp = Math.min.apply(null, selectedMetrics.map(e => this.data[e].minTimestamp));
      this.lastUpdatedTimestamp = minSelectedTimestamp < this.minSelected ? this.minSelected : minSelectedTimestamp;
    }
    const maxSelectedTimestamp = Math.max.apply(null, selectedMetrics.map(e => this.data[e].maxTimestamp));
    const max = maxSelectedTimestamp > this.maxSelected ? this.maxSelected : maxSelectedTimestamp;

    while (this.lastUpdatedTimestamp <= max) {
      this.lineChartLabels.push(new Date(this.lastUpdatedTimestamp * 1000));

      for (const metricName of Object.keys(this.chartMetricIndex)) {
        const metricIndex = this.chartMetricIndex[metricName];

        if (this.data[metricName].metricValues[this.lastUpdatedTimestamp]) {
          const metricValue = this.data[metricName].metricValues[this.lastUpdatedTimestamp].value;

          this.lineChartData[metricIndex].data.push(metricValue);
        } else {
          this.lineChartData[metricIndex].data.push(undefined);
        }
      }

      this.lastUpdatedTimestamp++;
    }

    const averages = Object.keys(this.chartMetricIndex)
      .map(e => ({ metricName: e, runningAverage: this.data[e].runningAverage }))
      .sort((a, b) => a.runningAverage - b.runningAverage)
      .map((e, i, arr) => ({
        metricName: e.metricName,
        runningAverage: e.runningAverage,
        diff: i === 0 ? e.runningAverage : e.runningAverage - arr[i - 1].runningAverage
      }));
    const maxAverage = Math.max.apply(null, averages.map(e => e.diff));
    for (const metric of averages) {
      const metricIndex = this.chartMetricIndex[metric.metricName];
      if (metric.runningAverage < maxAverage) {
        this.lineChartData[metricIndex].yAxisID = 'y-axis-right';
        this.lineChartData[metricIndex].label = `${this.data[metric.metricName].metricDisplayName} (Right Y Axis)`;
      } else {
        this.lineChartData[metricIndex].yAxisID = 'y-axis-left';
        this.lineChartData[metricIndex].label = `${this.data[metric.metricName].metricDisplayName} (Left Y Axis)`;
      }
    }
    // console.log(averages);
    // this.lineChartLabels = this.lineChartData[0].data.map((value) => value.toString());
  }

  downloadLogs(allMetrics: boolean, fullTimeline: boolean): void {
    const metricNames = allMetrics ? this.metricsList.map(e => e.name) : this.chartFiltersForm.get('displayGraphs').value as string[];
    let output = '';
    for (const metricName of metricNames) {
      const metric = this.data[metricName];
      output += `# HELP ${metricName} ${metric.metricDisplayName}\n`;
      output += `# TYPE ${metricName} ${metric.metricType}\n`;
      const valueKeys = (fullTimeline ?
        Object.keys(metric.metricValues) :
        Object.keys(metric.metricValues).filter(e => +e >= this.minSelected && +e <= this.maxSelected)
      )
        .sort((a, b) => +a - +b)
        .map(e => +e);

      for (const metricValueKey of valueKeys) {
        const metricValue = metric.metricValues[metricValueKey];
        output += `${metricName} ${metricValue.value} ${metricValue.timestampReceived}\n`;
      }
    }

    this.generateFile(output, getTimestampBasedFilename('.txt', new Date()), 'text/plain');
  }

  downloadChart(): void {
    const backgroundColor = getComputedStyle(document.querySelector('.app-body')).backgroundColor;
    const canvas = document.getElementById('metrics-chart-js-canvas') as HTMLCanvasElement;
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
    pdf.setFillColor(backgroundColor);
    pdf.rect(0, 0, canvas.width, canvas.height, 'F');
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save(getTimestampBasedFilename('.pdf', new Date()));
  }

  generateFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }
}
