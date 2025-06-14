# A/B Test Statistical Analysis Platform

## Overview

This is a full-stack web application for performing statistical significance testing on A/B test data. The platform provides comprehensive statistical analysis including chi-square tests, z-tests, confidence intervals, and effect size calculations. The application consists of a Python Flask backend for statistical computations and an Angular frontend for data input and results visualization.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python 3.11) with Gunicorn for production deployment
- **Scientific Computing**: NumPy and SciPy for advanced statistical calculations
- **API Design**: RESTful JSON API with single calculation endpoint (`/api/calculate`)
- **Web Server**: Gunicorn with auto-reload and port reuse capabilities
- **Static Asset Serving**: Flask serves compiled Angular application from `frontend/dist/`

### Frontend Architecture
- **Framework**: Angular 19 with TypeScript and standalone component architecture
- **Build System**: Angular CLI with modern application builder
- **Styling**: SCSS with Bootstrap 5 integration and custom CSS variables for theming
- **Theme**: Dark theme implementation with comprehensive color scheme
- **HTTP Client**: Angular HttpClient for API communication
- **Component Structure**: Modular design with form, results, and educational components

### Data Storage
- **No persistent storage**: Application operates on session-based calculations
- **Future extensibility**: PostgreSQL dependencies included for potential database integration

## Key Components

### Backend Components

1. **Statistical Engine** (`ab_test.py`)
   - Core statistical calculations including conversion rate analysis
   - Chi-square test implementation for categorical data analysis
   - Z-test for proportions comparison
   - Confidence interval calculations using normal distribution
   - Effect size measurements (Cohen's h)

2. **API Layer** (`app.py`)
   - Single endpoint Flask application with JSON API
   - Input validation for sample sizes and conversion counts
   - Error handling with appropriate HTTP status codes
   - Static file serving for Angular frontend integration

3. **Application Entry Point** (`main.py`)
   - Development server configuration with debug mode
   - Host binding to 0.0.0.0 for external access

### Frontend Components

1. **Main Application** (`app.component.ts`)
   - Root component with hero section and navigation
   - Component orchestration and data flow management

2. **Form Component** (`ab-test-form/ab-test-form.component.ts`)
   - Reactive forms with validation for A/B test data input
   - Real-time validation for sample sizes and conversion counts
   - User-friendly error messaging and form state management

3. **Results Component** (`ab-test-results/ab-test-results.component.ts`)
   - Statistical results display with significance indicators
   - Chart.js integration for data visualization
   - Formatted metrics display with confidence intervals

4. **Educational Component** (`statistical-concepts/statistical-concepts.component.ts`)
   - Accordion-based educational content about statistical testing
   - Explanations of p-values, confidence intervals, and effect sizes

### Data Models

**AbTestInput Interface**:
- `control_size`: Sample size of control group
- `control_conversions`: Number of conversions in control group
- `variation_size`: Sample size of variation group  
- `variation_conversions`: Number of conversions in variation group

**AbTestResults Interface**:
- Individual group statistics (conversion rates, confidence intervals)
- Difference metrics (absolute, relative, confidence intervals)
- Statistical test results (chi-square, z-test)
- Effect size calculations and interpretations
- Significance determination and recommendations

## Data Flow

1. **User Input**: Form component collects A/B test parameters with real-time validation
2. **API Request**: HTTP POST to `/api/calculate` with test parameters
3. **Statistical Processing**: Backend performs comprehensive statistical analysis
4. **Results Display**: Frontend receives and visualizes results with charts and metrics
5. **Educational Context**: Users can access explanatory content about statistical concepts

## External Dependencies

### Backend Dependencies
- **Flask 3.1.1**: Web framework for API and static file serving
- **NumPy 2.2.5**: Numerical computing for statistical calculations
- **SciPy 1.15.3**: Advanced statistical functions and tests
- **Gunicorn 23.0.0**: WSGI HTTP server for production deployment
- **psycopg2-binary**: PostgreSQL adapter (for future database integration)

### Frontend Dependencies
- **Angular 19.2.14**: Complete frontend framework with TypeScript support
- **Bootstrap 5.3.6**: CSS framework for responsive design and components
- **Chart.js 4.4.9**: Data visualization library for statistical charts
- **RxJS 7.8.2**: Reactive programming library for HTTP operations

## Deployment Strategy

### Development Environment
- **Platform**: Replit with multi-language support (Python 3.11 + Node.js 20)
- **Process Management**: Gunicorn with `--reload` flag for development
- **Port Configuration**: Internal port 5000 mapped to external port 80
- **Build Process**: Angular CLI builds to `frontend/dist/` served by Flask

### Production Deployment
- **Autoscale Deployment**: Configured for automatic scaling based on demand
- **Process Management**: Gunicorn with optimized worker configuration
- **Static Assets**: Angular production build with optimization and minification
- **Error Handling**: Comprehensive error responses and logging

### Architectural Decisions

1. **Single-page Application**: Chosen for better user experience and real-time calculations
2. **RESTful API**: Simple, stateless design for easy testing and integration
3. **Scientific Libraries**: NumPy/SciPy selected for robust, peer-reviewed statistical implementations
4. **Standalone Components**: Angular standalone architecture for better tree-shaking and performance
5. **Dark Theme**: Modern UI design with comprehensive CSS variable system for maintainability

## Changelog

- June 14, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.