# Statistical Analysis Platform

## Overview

A full-stack web application for performing comprehensive statistical significance testing on A/B test data. The platform provides advanced statistical analysis including chi-square tests, z-tests, confidence intervals, and effect size measurements with enterprise-grade visualizations.

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
- **Visualization**: Chart.js for statistical data visualization

## Key Components

### Backend Components

1. **Statistical Engine** (`statistical_analysis.py`):
   - A/B testing with multiple statistical tests (Chi-square, Z-test)
   - Fisher's Exact Test and Barnard's Exact Test support
   - Chi-square with Yates' correction and G-test for likelihood ratios
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
4. **Educational Component** (`statistical-concepts.component.ts`): Interactive explanations of statistical concepts
5. **Service Layer** (`ab-test.service.ts`): HTTP service for API communication
6. **Data Models** (`ab-test.model.ts`): TypeScript interfaces for type safety

## Data Flow

1. **User Input**: Users enter A/B test data (sample sizes and conversions) through the Angular form
2. **Validation**: Frontend validates input before submission
3. **API Request**: Angular service sends POST request to `/api/calculate` endpoint
4. **Statistical Processing**: Flask backend processes data using NumPy/SciPy statistical functions
5. **Results Return**: Comprehensive statistical results returned as JSON
6. **Visualization**: Frontend displays results with charts and statistical interpretations

## External Dependencies

### Backend Dependencies
- **Flask**: Web framework for API and static file serving
- **NumPy**: Numerical computing for statistical calculations
- **SciPy**: Advanced statistical functions and tests
- **Gunicorn**: Production WSGI server
- **PostgreSQL**: Database driver (ready for future data persistence)

### Frontend Dependencies
- **Angular 19**: Modern web framework with standalone components
- **Bootstrap 5**: UI component library with dark theme support
- **Chart.js**: Data visualization library for statistical charts
- **Font Awesome**: Icon library for enhanced UI
- **RxJS**: Reactive programming for HTTP operations

## Deployment Strategy

### Production Deployment
- **Platform**: Replit autoscale deployment target
- **Web Server**: Gunicorn with bind to 0.0.0.0:5000
- **Build Process**: Angular CLI builds frontend assets to dist folder
- **Static Assets**: Flask serves Angular build artifacts
- **Port Configuration**: Internal port 5000 mapped to external port 80

### Development Environment
- **Hot Reload**: Gunicorn with --reload flag for development
- **Parallel Workflows**: Replit workflow configuration for concurrent processes
- **Environment**: Python 3.11 and Node.js 20 modules with required system packages

## Changelog

- June 15, 2025. Initial setup
- June 15, 2025. Applied deployment fixes:
  * Updated Python version compatibility (3.11/3.12)
  * Fixed TypeScript interfaces for statistical tests
  * Built Angular frontend for production
  * Configured .gitignore to prevent build artifacts from commits
- June 16, 2025. Fixed Angular frontend serving:
  * Corrected Flask static folder path to point to browser subdirectory
  * Confirmed Angular application loads successfully
- June 16, 2025. Modernized frontend design:
  * Implemented vibrant color palette with purple, cyan, and emerald gradients
  * Added glassmorphism effects with backdrop blur and transparency
  * Integrated animated gradient backgrounds and rotating elements
  * Enhanced buttons with shimmer effects and hover animations
  * Upgraded form controls with modern glass styling
  * Improved responsive design for mobile compatibility

## User Preferences

Preferred communication style: Simple, everyday language.