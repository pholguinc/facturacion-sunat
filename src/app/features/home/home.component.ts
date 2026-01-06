import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexGrid, ApexStroke, ApexTitleSubtitle, ChartComponent, NgApexchartsModule, ApexNonAxisChartSeries, ApexResponsive, ApexPlotOptions, ApexFill, ApexLegend, ApexYAxis, ApexTooltip } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  labels: string[];
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgApexchartsModule, MatCardModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class Home {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chartDonut") chartDonut!: ChartComponent;
  public chartOptionsDonut: Partial<ChartOptions>;

  @ViewChild("chartBar") chartBar!: ChartComponent;
  public chartOptionsBar: Partial<ChartOptions>;

  @ViewChild("chartBaseIgv") chartBaseIgv!: ChartComponent;
  public chartOptionsBaseIgv: Partial<ChartOptions>;

  @ViewChild("chartComp") chartComp!: ChartComponent;
  public chartOptionsComp: Partial<ChartOptions>;

  @ViewChild("chartTopClients") chartTopClients!: ChartComponent;
  public chartOptionsTopClients: Partial<ChartOptions>;

  constructor() {
    // 1️⃣ Ventas en el tiempo – Line Chart
    this.chartOptions = {
      series: [
        {
          name: "Ventas 2026",
          data: [12500, 15000, 14200, 18000, 21000, 19500, 23000, 25000, 24500]
        }
      ],
      chart: {
        height: 350,
        type: "area", // Area looks nicer for trends
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      title: {
        text: "Ventas Mensuales (S/.)",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep"]
      }
    };

    // 2️⃣ Facturas por tipo de comprobante – Donut
    this.chartOptionsDonut = {
      series: [440, 205, 41, 17],
      chart: {
        width: "100%",
        type: "donut"
      },
      labels: ["Facturas", "Boletas", "Notas de Crédito", "Notas de Débito"],
      title: {
        text: "Distribución por Comprobante",
        align: "left"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: "bottom" }
          }
        }
      ]
    };

    // 3️⃣ Ventas por tipo de afectación SUNAT – Bar Chart
    this.chartOptionsBar = {
      series: [
        {
          name: "Monto",
          data: [85000, 12000, 5000, 1500]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4
        }
      },
      dataLabels: { enabled: true },
      xaxis: {
        categories: ["Gravadas (IGV)", "Exoneradas", "Inafectas", "Exportación"]
      },
      title: {
        text: "Ventas por Tipo de Afectación",
        align: "left"
      }
    };

    // 4️⃣ IGV vs Base imponible – Stacked Bar
    this.chartOptionsBaseIgv = {
      series: [
        {
          name: "Base Imponible",
          data: [10000, 12000, 11500, 15000, 18000, 17000]
        },
        {
          name: "IGV (18%)",
          data: [1800, 2160, 2070, 2700, 3240, 3060]
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "left"
      },
      title: {
        text: "Relación Base Imponible vs IGV",
        align: "left"
      }
    };

    // 5️⃣ Comparativa de Sucursales – Multi-Line
    this.chartOptionsComp = {
      series: [
        { name: "Sede Principal", data: [5000, 7000, 6500, 8000, 9500, 9000] },
        { name: "Sucursal Norte", data: [3000, 3500, 3200, 4100, 4800, 4500] },
        { name: "Sucursal Sur", data: [2000, 1500, 1800, 2900, 3200, 3500] }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      title: { text: "Comparativa de Ventas por Sucursal", align: "left" },
      grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } },
      xaxis: { categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"] }
    };

    // 6️⃣ Top Clientes (Facturación) – Bar
    this.chartOptionsTopClients = {
      series: [{ name: "Total Facturado", data: [45000, 32000, 28000, 15000, 12000] }],
      chart: { type: "bar", height: 350 },
      plotOptions: {
        bar: { horizontal: true, borderRadius: 4, barHeight: '50%' }
      },
      dataLabels: { enabled: true, formatter: (val) => `S/ ${val}` },
      xaxis: { categories: ["Minera Las Bambas", "Alicorp S.A.A.", "Constructora Graña", "Banco BCP", "Agroindustria del Sur"] },
      title: { text: "Top 5 Clientes que más facturan", align: "left" }
    };
  }
}
