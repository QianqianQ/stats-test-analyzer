# Statistical Analysis Platform

## Overview

This is a full-stack web application for performing statistical significance testing on A/B test data. The platform provides comprehensive statistical analysis including chi-square tests, z-tests, confidence intervals, and effect size measurements. It features a Python Flask backend with NumPy/SciPy for statistical calculations and an Angular 19 frontend with Bootstrap styling.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python 3.11+) with RESTful API design
- **Scientific Computing**: NumPy and SciPy for advanced statistical calculations
- **Web Server**: Gunicorn for production deployment with autoscale capabilities
- **API Design**: Single JSON endpoint (`/api/calculate`) for statistical computations
- **Static Serving**: Flask serves Angular build artifacts for production deployment

### Frontend Architecture
- **Framework**: Angular 19 with TypeScript and standalone components
- **Build System**: Angular CLI with modern application builder
- **Styling**: SCSS with Bootstrap 5 integration and custom dark theme
- **Components**: Modular architecture with form input, results display, and educational components
- **HTTP Client**: Angular HttpClient for API communication

### Data Storage
- **Current State**: No persistent storage - stateless calculations
- **Database Ready**: Project structure includes PostgreSQL dependencies for future data persistence

## Key Components

### Backend Components
1. **Statistical Engine** (`statistical_analysis.py`): 
   - A/B testing with multiple statistical tests (Chi-square, Z-test)
   - Fisher's Exact Test and Barnard's Exact Test support
   - Confidence interval calculations and effect size measurements (Cohen's h)
   - Advanced statistical metrics and comprehensive result formatting

2. **API Layer** (`app.py`):
   - Single POST endpoint `/api/calculate` for statistical computations
   - JSON input/output with comprehensive validation
   - Error handling for invalid inputs and edge cases
   - Static file serving for Angular frontend integration

3. **Application Entry Point** (`main.py`): Development server configuration

### Frontend Components
1. **Main Application** (`app.component.ts`): Root component with hero section and navigation
2. **Form Component** (`ab-test-form.component.ts`): Input interface with validation for A/B test data
3. **Results Component** (`ab-test-results.component.ts`): Statistical results display with Chart.js visualizations
4. **Concepts Component** (`statistical-concepts.component.ts`): Educational content about statistical testing
5. **Service Layer** (`ab-test.service.ts`): HTTP service for API communication

### Data Models
- **AbTestInput**: Interface for test parameters (sample sizes and conversions)
- **AbTestResults**: Comprehensive results interface including statistical tests, confidence intervals, and effect sizes

## Data Flow

1. **User Input**: Users enter A/B test data (sample sizes and conversions) via Angular form
2. **Validation**: Frontend validates inputs before submission
3. **API Request**: Angular service sends POST request to `/api/calculate`
4. **Statistical Processing**: Flask backend processes data using NumPy/SciPy
5. **Results Return**: Comprehensive statistical results returned as JSON
6. **Visualization**: Angular displays results with charts and statistical interpretations

## External Dependencies

### Backend Dependencies
- **Flask 3.1.1+**: Web framework and API layer
- **NumPy 2.2.5+**: Numerical computing and array operations
- **SciPy 1.15.3+**: Advanced statistical functions and tests
- **Gunicorn 23.0.0+**: Production WSGI server
- **PostgreSQL (psycopg2-binary)**: Database connectivity (ready for future use)

### Frontend Dependencies
- **Angular 19.2.14**: Frontend framework and CLI
- **Bootstrap 5.3.6**: UI component library and styling
- **Chart.js 4.4.9**: Data visualization and charting
- **TypeScript 5.8.3**: Type-safe JavaScript development
- **RxJS 7.8.2**: Reactive programming and HTTP handling

### External CDN Resources
- **Bootstrap Dark Theme**: Replit-hosted Bootstrap theme
- **Font Awesome 6.4.0**: Icon library from Cloudflare CDN

## Deployment Strategy

### Platform Configuration
- **Deployment Target**: Replit autoscale with multi-language support
- **Runtime Environment**: Python 3.11 + Node.js 20 dual environment
- **Process Management**: Gunicorn with port binding (0.0.0.0:5000) and reload capabilities
- **Build Process**: Angular production build served by Flask static file handler

### Environment Setup
- **Nix Packages**: libxcrypt, openssl, pkg-config, postgresql, xsimd
- **Port Configuration**: Internal port 5000 mapped to external port 80
- **Development Mode**: Automatic reload enabled for development workflow

### Security Considerations
- Input validation for all statistical parameters
- CORS handling for API endpoints
- Secure parameter handling for sensitive configurations

## Changelog

Changelog:
- June 14, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.