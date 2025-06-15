# Statistical Analysis Platform

## Overview

This is a full-stack web application for performing statistical significance testing on A/B test data. The platform provides comprehensive statistical analysis including chi-square tests, z-tests, confidence intervals, and effect size calculations. It features a Flask backend with scientific computing capabilities and an Angular frontend with modern UI components and data visualization.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python 3.12) with RESTful API design
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
4. **Concepts Component** (`statistical-concepts.component.ts`): Educational content about statistical testing
5. **Service Layer** (`ab-test.service.ts`): HTTP service for API communication

### Data Models

**AbTestInput Interface**:
- `control_size`: Sample size of control group
- `control_conversions`: Number of conversions in control group
- `variation_size`: Sample size of variation group  
- `variation_conversions`: Number of conversions in variation group

**AbTestResults Interface**:
- Individual group statistics (conversion rates, confidence intervals)
- Difference metrics (absolute, relative, confidence intervals)
- Statistical test results (chi-square, z-test, Fisher's exact, Barnard's exact, G-test)
- Effect size calculations and interpretations
- Significance determination and recommendations

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
- **psycopg2-binary**: PostgreSQL adapter (for future database integration)
- **email-validator**: Email validation utilities
- **flask-sqlalchemy**: SQLAlchemy integration for Flask

### Frontend Dependencies
- **Angular 19.2.14**: Complete frontend framework with TypeScript support
- **Bootstrap 5.3.6**: CSS framework for responsive design and components
- **Chart.js 4.4.9**: Data visualization library for statistical charts
- **RxJS 7.8.2**: Reactive programming library for HTTP operations

### External CDN Resources
- **Bootstrap Dark Theme**: Replit-hosted Bootstrap theme (`https://cdn.replit.com/agent/bootstrap-agent-dark-theme.min.css`)
- **Font Awesome 6.4.0**: Icon library from Cloudflare CDN

## Deployment Strategy

### Development Environment
- **Platform**: Replit with multi-language support (Python 3.12 + Node.js 20)
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

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 20+
- npm or yarn

### Installation

1. **Backend Setup**:
   ```bash
   pip install -r requirements.txt
   # or using uv
   uv sync
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ng build --configuration production
   ```

3. **Run the Application**:
   ```bash
   python main.py
   # or using gunicorn
   gunicorn --bind 0.0.0.0:5000 --reload main:app
   ```

4. **Access the Application**:
   - Open your browser to `http://localhost:5000`
   - Enter A/B test data and calculate statistical significance

### Development Workflow

1. **Backend Development**: Edit Python files in the root directory
2. **Frontend Development**: Work in `frontend/src/` and rebuild using `ng build`
3. **Testing**: Use the web interface to validate statistical calculations
4. **Deployment**: Push to production with proper environment configuration

## Features

### Statistical Tests Supported
- **Chi-square Test**: With Yates' continuity correction
- **Z-test for Proportions**: Standard normal test for proportion differences
- **Fisher's Exact Test**: Exact test for independence in 2x2 tables
- **Barnard's Exact Test**: More powerful alternative to Fisher's exact test
- **G-test**: Likelihood ratio test for independence

### Calculations Provided
- Conversion rates with confidence intervals
- Absolute and relative difference measurements
- Effect size (Cohen's h) with interpretation
- P-values and statistical significance determination
- Recommended sample sizes for future tests

### User Interface Features
- Professional dark theme with Bootstrap styling
- Interactive form with real-time validation
- Chart.js visualizations for data comparison
- Educational content about statistical concepts
- Responsive design for mobile and desktop

## Changelog

- **June 14, 2025**: Renamed ab_test.py to statistical_analysis.py to reflect comprehensive test suite
- **June 14, 2025**: Upgraded to Python 3.12.7 with latest NumPy (2.2.5) and SciPy (1.15.3)
- **June 14, 2025**: Initial setup and platform development

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## User Preferences

Preferred communication style: Simple, everyday language.