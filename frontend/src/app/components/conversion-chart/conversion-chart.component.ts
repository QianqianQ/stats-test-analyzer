import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AbTestResults } from '../../models/ab-test.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-conversion-chart',
  templateUrl: './conversion-chart.component.html',
  styleUrls: ['./conversion-chart.component.scss']
})
export class ConversionChartComponent implements OnChanges, AfterViewInit {
  @Input() controlData: any;
  @Input() variationData: any;
  @ViewChild('chart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: any = null;
  
  constructor() { }
  
  ngAfterViewInit(): void {
    if (this.controlData && this.variationData) {
      this.createChart();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['controlData'] || changes['variationData']) && this.chartCanvas) {
      this.createChart();
    }
  }
  
  private createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    if (!ctx) {
      return;
    }
    
    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
    
    // Format function for percentage labels
    const formatPercent = (value: number, decimals = 1) => {
      return (value * 100).toFixed(decimals) + '%';
    };
    
    // Create chart data
    const data = {
      labels: ['Control (A)', 'Variation (B)'],
      datasets: [{
        label: 'Conversion Rate',
        data: [
          this.controlData.conversion_rate,
          this.variationData.conversion_rate
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(75, 192, 192)'
        ],
        borderWidth: 1
      }]
    };
    
    // Error bars for confidence intervals
    const errorBars = {
      id: 'errorBars',
      afterDatasetDraw(chart: any, args: any, options: any) {
        const { ctx, data, chartArea, scales } = chart;
        
        // Set up drawing properties
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        
        // Draw error bars for each dataset point
        data.datasets.forEach((dataset: any, datasetIndex: number) => {
          // Only process the first dataset (our conversion rates)
          if (datasetIndex === 0) {
            dataset.data.forEach((datapoint: any, index: number) => {
              // Calculate the error bar bounds
              let lowerBound, upperBound;
              
              if (index === 0) {
                lowerBound = args.component.controlData.ci_lower;
                upperBound = args.component.controlData.ci_upper;
              } else {
                lowerBound = args.component.variationData.ci_lower;
                upperBound = args.component.variationData.ci_upper;
              }
              
              // Convert to y-coordinates
              const yLower = scales.y.getPixelForValue(upperBound);
              const yUpper = scales.y.getPixelForValue(lowerBound);
              
              // Get x position
              const x = scales.x.getPixelForValue(index);
              
              // Draw vertical line
              ctx.beginPath();
              ctx.moveTo(x, yLower);
              ctx.lineTo(x, yUpper);
              ctx.stroke();
              
              // Draw horizontal caps
              const capWidth = 10;
              
              // Upper cap
              ctx.beginPath();
              ctx.moveTo(x - capWidth / 2, yLower);
              ctx.lineTo(x + capWidth / 2, yLower);
              ctx.stroke();
              
              // Lower cap
              ctx.beginPath();
              ctx.moveTo(x - capWidth / 2, yUpper);
              ctx.lineTo(x + capWidth / 2, yUpper);
              ctx.stroke();
            });
          }
        });
      }
    };
    
    // Chart configuration
    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: number) {
                return formatPercent(value, 1);
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return formatPercent(context.raw, 2);
              }
            }
          },
          legend: {
            display: false
          }
        }
      },
      plugins: [{ 
        id: 'errorBars', 
        beforeDraw: (chart: any) => {
          const { ctx, data, chartArea, scales } = chart;
          
          // Set up drawing properties
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 2;
          
          // Draw error bars for each dataset point
          data.datasets.forEach((dataset: any, datasetIndex: number) => {
            // Only process the first dataset (our conversion rates)
            if (datasetIndex === 0) {
              dataset.data.forEach((datapoint: any, index: number) => {
                // Calculate the error bar bounds
                let lowerBound, upperBound;
                
                if (index === 0) {
                  lowerBound = this.controlData.ci_lower;
                  upperBound = this.controlData.ci_upper;
                } else {
                  lowerBound = this.variationData.ci_lower;
                  upperBound = this.variationData.ci_upper;
                }
                
                // Convert to y-coordinates
                const yLower = scales.y.getPixelForValue(upperBound);
                const yUpper = scales.y.getPixelForValue(lowerBound);
                
                // Get x position
                const x = scales.x.getPixelForValue(index);
                
                // Draw vertical line
                ctx.beginPath();
                ctx.moveTo(x, yLower);
                ctx.lineTo(x, yUpper);
                ctx.stroke();
                
                // Draw horizontal caps
                const capWidth = 10;
                
                // Upper cap
                ctx.beginPath();
                ctx.moveTo(x - capWidth / 2, yLower);
                ctx.lineTo(x + capWidth / 2, yLower);
                ctx.stroke();
                
                // Lower cap
                ctx.beginPath();
                ctx.moveTo(x - capWidth / 2, yUpper);
                ctx.lineTo(x + capWidth / 2, yUpper);
                ctx.stroke();
              });
            }
          });
          
          ctx.restore();
        }
      }]
    };
    
    // Create the chart
    this.chart = new Chart(ctx, config as any);
  }
}