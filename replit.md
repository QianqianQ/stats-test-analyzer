# Statistical Analysis Platform

## Overview

This is a full-stack web application designed for performing comprehensive statistical significance testing on A/B test data. The platform combines a Flask-based Python backend with an Angular frontend to provide enterprise-grade statistical analysis capabilities including chi-square tests, z-tests, confidence intervals, and effect size measurements.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python 3.11+) with RESTful API design
- **Scientific Computing**: NumPy and SciPy for advanced statistical calculations
- **Web Server**: Gunicorn for production deployment with autoscale capabilities
- **API Design**: Single JSON endpoint (`/api/calculate`) for stateless statistical computations
- **Static Serving**: Flask serves Angular build artifacts for integrated deployment

### Frontend Architecture
- **Framework**: Angular 19 with TypeScript and standalone components
- **Build System**: Angular CLI with modern application builder
- **Styling**: SCSS with Bootstrap 5 integration and custom dark theme
- **Visualization**: Chart.js for statistical data visualization
- **Components**: Modular architecture with form input, results display, and educational components
- **HTTP Client**: Angular HttpClient for API communication

### Data Storage
- **Current State**: Stateless calculations with no persistent storage
- **Database Ready**: PostgreSQL dependencies included for future data persistence features

## Key Components

### Backend Components

1. **Statistical Engine** (`statistical_analysis.py`):
   - Core statistical calculations for A/B testing
   - Multiple test methods: Chi-square, Z-test, Fisher's Exact Test
   - Confidence interval calculations and effect size measurements
   - Advanced metrics including Cohen's h for effect size interpretation

2. **API Layer** (`app.py`):
   - RESTful endpoint at `/api/calculate` for statistical computations
   - JSON input/output with comprehensive validation
   - Error handling for edge cases and invalid inputs
   - Integrated static file serving for frontend deployment

3. **Application Entry Point** (`main.py`):
   - Development server configuration
   - Flask application initialization

### Frontend Components

1. **Main Application** (`app.component.ts`):
   - Root component with hero section and navigation
   - Component orchestration and layout management

2. **Form Component** (`ab-test-form.component.ts`):
   - User input interface with reactive forms
   - Real-time validation for A/B test data
   - Input sanitization and error handling

3. **Results Component** (`ab-test-results.component.ts`):
   - Statistical results visualization with Chart.js
   - Comprehensive metrics display with confidence intervals
   - Interactive charts and significance indicators

4. **Educational Component** (`statistical-concepts.component.ts`):
   - Educational content about statistical concepts
   - Accordion-style interface for learning resources

## Data Flow

1. **User Input**: Users enter A/B test data through the Angular form component
2. **Validation**: Frontend validates input data before submission
3. **API Request**: HTTP POST request sent to `/api/calculate` endpoint
4. **Statistical Processing**: Backend performs comprehensive statistical analysis
5. **Response**: JSON results returned with all statistical metrics
6. **Visualization**: Frontend displays results with charts and significance indicators

## External Dependencies

### Backend Dependencies
- **Flask**: Web framework for API and static serving
- **NumPy**: Numerical computing for statistical calculations
- **SciPy**: Advanced statistical functions and tests
- **Gunicorn**: Production WSGI server
- **PostgreSQL**: Database support (via psycopg2-binary)

### Frontend Dependencies
- **Angular 19**: Modern web framework with TypeScript
- **Bootstrap 5**: UI component library with dark theme
- **Chart.js**: Data visualization library
- **RxJS**: Reactive programming for HTTP requests
- **Font Awesome**: Icon library for UI enhancement

## Deployment Strategy

### Production Deployment
- **Platform**: Replit autoscale deployment target
- **Web Server**: Gunicorn with bind to 0.0.0.0:5000
- **Port Configuration**: Internal port 5000 mapped to external port 80
- **Process Management**: Parallel workflow execution with reload capabilities

### Development Environment
- **Runtime**: Node.js 20 + Python 3.11 hybrid environment
- **Package Management**: UV for Python dependencies, NPM for frontend
- **Build Process**: Angular CLI builds to `frontend/dist/ab-test-frontend`
- **Hot Reload**: Gunicorn reload flag enabled for development

## Changelog

```
Changelog:
- June 15, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```