# A/B Test Statistical Analysis Platform

## Overview

This is a full-stack web application for performing statistical significance testing on A/B test data. The platform provides comprehensive statistical analysis including chi-square tests, z-tests, confidence intervals, and effect size calculations. It features a Flask backend with scientific computing capabilities and an Angular frontend with modern UI components and data visualization.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python 3.12)
- **Scientific Computing**: NumPy and SciPy for statistical calculations
- **Web Server**: Gunicorn for production deployment
- **API Design**: RESTful JSON API with single calculation endpoint

### Frontend Architecture
- **Framework**: Angular 19 with TypeScript
- **Build System**: Angular CLI with modern application builder
- **Styling**: SCSS with Bootstrap 5 integration
- **Theme**: Dark theme with custom CSS variables
- **Components**: Standalone component architecture

### Deployment Strategy
- **Platform**: Replit with autoscale deployment
- **Runtime**: Multi-language environment (Python 3.12 + Node.js 20)
- **Process Management**: Gunicorn with port binding and reloading
- **Static Assets**: Angular build output served by Flask

## Key Components

### Backend Components
1. **Statistical Engine** (`ab_test.py`): Core statistical calculations including:
   - Conversion rate analysis
   - Chi-square and Z-test implementations
   - Confidence interval calculations
   - Effect size measurements

2. **API Layer** (`app.py`): Flask application with:
   - JSON API endpoint for calculations
   - Input validation and error handling
   - Static file serving for Angular frontend

3. **Application Entry Point** (`main.py`): Development server configuration

### Frontend Components
1. **Main Application** (`app.component.ts`): Root component with hero section and navigation
2. **Form Component**: A/B test data input interface
3. **Results Component**: Statistical results display with visualizations
4. **Concepts Component**: Educational content about statistical testing

### Data Models
- **AbTestInput**: Input data structure for test parameters
- **AbTestResults**: Comprehensive results including statistical tests and confidence intervals

## Data Flow

1. **User Input**: Users enter A/B test data (sample sizes and conversions) through Angular form
2. **API Request**: Frontend sends POST request to `/api/calculate` endpoint
3. **Statistical Processing**: Backend validates input and performs comprehensive statistical analysis
4. **Response**: Detailed results including significance tests, confidence intervals, and effect sizes
5. **Visualization**: Frontend displays results with charts and statistical interpretations

## External Dependencies

### Backend Dependencies
- **Flask**: Web framework and static file serving
- **NumPy**: Numerical computing and array operations
- **SciPy**: Statistical functions and hypothesis testing
- **Gunicorn**: Production WSGI server
- **psycopg2-binary**: PostgreSQL adapter (configured but not currently used)

### Frontend Dependencies
- **Angular**: Modern web framework with TypeScript
- **Bootstrap**: UI component library with dark theme
- **Chart.js**: Data visualization library
- **Font Awesome**: Icon library for UI elements
- **RxJS**: Reactive programming for HTTP requests

## Deployment Strategy

The application is configured for deployment on Replit with:
- **Multi-runtime Environment**: Python 3.11 and Node.js 20 support
- **Autoscale Deployment**: Automatic scaling based on traffic
- **Port Configuration**: Internal port 5000 mapped to external port 80
- **Process Management**: Gunicorn with reload capabilities for development
- **Build Process**: Angular production build integrated with Flask static serving

The deployment uses a parallel workflow that starts the Gunicorn server with automatic reloading for development convenience while maintaining production readiness.

## Changelog

- June 14, 2025. Upgraded to Python 3.12.7 with latest NumPy (2.2.5) and SciPy (1.15.3)
- June 13, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.