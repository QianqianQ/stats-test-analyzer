import os
import logging
from flask import Flask, request, jsonify, render_template
from ab_test import calculate_ab_test_results

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
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


@app.route('/')
def index():
    """Serve the main application page"""
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
