import os
import logging
from flask import Flask, request, jsonify, send_from_directory
from ab_test import calculate_ab_test_results

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Define path to Angular dist directory
angular_dist_folder = os.path.join(os.getcwd(), 'frontend', 'dist', 'ab-test-frontend')

# Create Flask app
app = Flask(__name__, static_folder=angular_dist_folder)
app.secret_key = os.environ.get("SESSION_SECRET",
                                "default-secret-key-for-development")


@app.route('/api/calculate', methods=['POST'])
def calculate():
    """
    Process the A/B test data and return the statistical analysis results.
    
    Expected JSON input:
    {
        "control_size": int,
        "control_conversions": int,
        "variation_size": int,
        "variation_conversions": int
    }
    """
    try:
        data = request.get_json()
        print(data)
        # Extract values
        control_size = int(data.get('control_size', 0))
        control_conversions = int(data.get('control_conversions', 0))
        variation_size = int(data.get('variation_size', 0))
        variation_conversions = int(data.get('variation_conversions', 0))

        # Validate inputs
        if control_size <= 0 or variation_size <= 0:
            return jsonify({'error':
                            'Sample sizes must be positive numbers'}), 400

        if control_conversions < 0 or variation_conversions < 0:
            return jsonify({'error':
                            'Conversion counts cannot be negative'}), 400

        if control_conversions > control_size or variation_conversions > variation_size:
            return jsonify(
                {'error': 'Conversion counts cannot exceed sample sizes'}), 400

        # Calculate results
        results = calculate_ab_test_results(control_size, control_conversions,
                                            variation_size,
                                            variation_conversions)
        print(results)
        return jsonify(results)

    except ValueError as e:
        app.logger.error(f"Value error in calculation: {str(e)}")
        return jsonify({'error': f'Invalid input values: {str(e)}'}), 400
    except Exception as e:
        app.logger.error(f"Error in calculation: {str(e)}")
        return jsonify({'error': 'An error occurred during calculation'}), 500


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_angular(path=''):
    """Serve the Angular app for all routes"""
    try:
        if path != "" and os.path.exists(os.path.join(angular_dist_folder, path)):
            return send_from_directory(angular_dist_folder, path)
        else:
            if os.path.exists(os.path.join(angular_dist_folder, 'index.html')):
                return send_from_directory(angular_dist_folder, 'index.html')
            else:
                return """
                <html>
                    <head><title>A/B Test Calculator</title></head>
                    <body>
                        <h1>Angular frontend not built yet</h1>
                        <p>Run 'cd frontend && npm install && npm run build' to build the Angular frontend.</p>
                    </body>
                </html>
                """
    except Exception as e:
        logging.error(f"Error serving file: {e}")
        return "Error loading application", 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
