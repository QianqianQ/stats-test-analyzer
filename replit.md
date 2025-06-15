# Statistical Analysis Platform

## Overview

This is a full-stack web application for performing statistical significance testing on A/B test data. The platform provides comprehensive statistical analysis including chi-square tests, z-tests, confidence intervals, and effect size measurements. Built with Flask backend and Angular frontend, it's designed to be a production-ready statistical testing platform with enterprise-grade features.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python 3.11+) with RESTful API design
- **Scientific Computing**: NumPy and SciPy for advanced statistical calculations
- **Web Server**: Gunicorn for production deployment with autoscale capabilities
- **API Design**: Single JSON endpoint (`/api/calculate`) for statistical computations
- **Static Serving**: Flask serves Angular build artifacts for production deployment

The backend follows a modular design with clear separation of concerns:
- `app.py`: Main Flask application with API endpoints and static file serving
- `statistical_analysis.py`: Core statistical computation engine
- `main.py`: Development server entry point

### Frontend Architecture
- **Framework**: Angular 19 with TypeScript and standalone components
- **Build System**: Angular CLI with modern application builder
- **Styling**: SCSS with Bootstrap 5 integration and custom dark theme
- **Components**: Modular architecture with form input, results display, and educational components
- **HTTP Client**: Angular HttpClient for API communication

The frontend uses standalone components for better tree-shaking and modern Angular practices.

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
4. **Educational Component** (`statistical-concepts.component.ts`): User education on statistical concepts
5. **Service Layer** (`ab-test.service.ts`): HTTP service for API communication
6. **Data Models** (`ab-test.model.ts`): TypeScript interfaces for type safety

## Data Flow

1. **User Input**: Users enter A/B test data through the Angular form component
2. **Validation**: Frontend validates input data before submission
3. **API Request**: Angular service sends POST request to Flask `/api/calculate` endpoint
4. **Statistical Processing**: Python backend performs comprehensive statistical analysis using NumPy/SciPy
5. **Response**: JSON results returned with statistical metrics, confidence intervals, and significance tests
6. **Visualization**: Angular displays results with charts and formatted metrics

## External Dependencies

### Backend Dependencies
- **Flask**: Web framework for API and static serving
- **NumPy**: Numerical computing for statistical calculations
- **SciPy**: Advanced statistical functions and tests
- **Gunicorn**: Production WSGI server
- **psycopg2-binary**: PostgreSQL adapter (prepared for future database integration)

### Frontend Dependencies
- **Angular 19**: Modern web framework with TypeScript
- **Bootstrap 5**: UI component library and responsive design
- **Chart.js**: Data visualization library for statistical charts
- **RxJS**: Reactive programming for HTTP operations

### External Services
- **Bootstrap CDN**: Custom dark theme stylesheet from Replit
- **Font Awesome CDN**: Icon library for UI enhancement

## Deployment Strategy

### Production Configuration
- **Web Server**: Gunicorn with autoscale deployment target
- **Port Configuration**: Internal port 5000, external port 80
- **Build Process**: Angular CLI builds to `frontend/dist/ab-test-frontend`
- **Static Serving**: Flask serves Angular production build
- **Environment**: Replit deployment with PostgreSQL, Node.js, and Python support

### Development Configuration
- **Parallel Workflows**: Separate development and production configurations
- **Hot Reload**: Gunicorn with `--reload` flag for development
- **Environment Variables**: Session secret key with fallback for development

The application is designed for stateless operation currently but includes database dependencies for future persistence needs.

## Changelog

```
Changelog:
- June 15, 2025. Initial setup
- June 15, 2025. Applied deployment fixes:
  * Updated Python version compatibility (3.11/3.12)
  * Fixed TypeScript interfaces for statistical tests
  * Built Angular frontend for production
  * Configured .gitignore to prevent build artifacts from commits
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```