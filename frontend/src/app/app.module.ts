import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AbTestFormComponent } from './components/ab-test-form/ab-test-form.component';
import { AbTestResultsComponent } from './components/ab-test-results/ab-test-results.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ConversionChartComponent } from './components/conversion-chart/conversion-chart.component';
import { StatisticalConceptsComponent } from './components/statistical-concepts/statistical-concepts.component';

@NgModule({
  declarations: [
    AppComponent,
    AbTestFormComponent,
    AbTestResultsComponent,
    NavbarComponent,
    HomeComponent,
    ConversionChartComponent,
    StatisticalConceptsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }