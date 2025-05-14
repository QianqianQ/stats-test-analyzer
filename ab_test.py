import numpy as np
import scipy.stats as stats

def calculate_ab_test_results(control_size, control_conversions, variation_size, variation_conversions):
    """
    Calculate statistical significance and other metrics for an A/B test.
    
    Args:
        control_size (int): Sample size of control group
        control_conversions (int): Number of conversions in control group
        variation_size (int): Sample size of variation group
        variation_conversions (int): Number of conversions in variation group
        
    Returns:
        dict: Results of statistical tests and metrics
    """
    # Calculate conversion rates
    control_rate = control_conversions / control_size if control_size > 0 else 0
    variation_rate = variation_conversions / variation_size if variation_size > 0 else 0
    
    # Calculate absolute and relative difference
    absolute_difference = variation_rate - control_rate
    relative_difference = (variation_rate - control_rate) / control_rate * 100 if control_rate > 0 else 0
    
    # Create contingency table for chi-square test
    contingency_table = np.array([
        [control_conversions, control_size - control_conversions],
        [variation_conversions, variation_size - variation_conversions]
    ])
    
    # Chi-Square Test
    chi2, p_chi2, dof, expected = stats.chi2_contingency(contingency_table)
    
    # Z-Test for proportions
    pooled_proportion = (control_conversions + variation_conversions) / (control_size + variation_size)
    std_error = np.sqrt(pooled_proportion * (1 - pooled_proportion) * (1/control_size + 1/variation_size))
    z_score = (variation_rate - control_rate) / std_error if std_error > 0 else 0
    p_value_z = 2 * (1 - stats.norm.cdf(abs(z_score)))  # Two-tailed test
    
    # Calculate 95% confidence interval for difference in proportions
    alpha = 0.05  # 95% confidence level
    critical_value = stats.norm.ppf(1 - alpha/2)  # 1.96 for 95% CI
    
    standard_error = np.sqrt(
        (control_rate * (1 - control_rate) / control_size) +
        (variation_rate * (1 - variation_rate) / variation_size)
    )
    
    ci_lower = absolute_difference - critical_value * standard_error
    ci_upper = absolute_difference + critical_value * standard_error
    
    # Calculate confidence intervals for individual rates
    ci_control_lower = control_rate - critical_value * np.sqrt(control_rate * (1 - control_rate) / control_size)
    ci_control_upper = control_rate + critical_value * np.sqrt(control_rate * (1 - control_rate) / control_size)
    
    ci_variation_lower = variation_rate - critical_value * np.sqrt(variation_rate * (1 - variation_rate) / variation_size)
    ci_variation_upper = variation_rate + critical_value * np.sqrt(variation_rate * (1 - variation_rate) / variation_size)
    
    # Effect size - Cohen's h
    h = 2 * np.arcsin(np.sqrt(variation_rate)) - 2 * np.arcsin(np.sqrt(control_rate))
    
    # Interpret effect size
    if abs(h) < 0.2:
        effect_size_interpretation = "small"
    elif abs(h) < 0.5:
        effect_size_interpretation = "medium"
    else:
        effect_size_interpretation = "large"
    
    # Statistical significance at 95% confidence level
    is_significant = p_value_z < 0.05
    
    # Sample size recommendation if not significant
    recommended_sample = 0
    if not is_significant:
        # Calculate sample size for 80% power at alpha=0.05
        effect = variation_rate - control_rate
        if effect != 0:
            pooled = (control_conversions + variation_conversions) / (control_size + variation_size)
            z_alpha = stats.norm.ppf(1 - 0.05/2)
            z_beta = stats.norm.ppf(0.8)
            p1 = control_rate
            p2 = variation_rate
            
            if p1 != p2:
                recommended_sample = ((z_alpha + z_beta)**2 * (p1 * (1 - p1) + p2 * (1 - p2))) / ((p1 - p2)**2)
                recommended_sample = max(int(np.ceil(recommended_sample)), 0)
    
    return {
        "control": {
            "sample_size": control_size,
            "conversions": control_conversions,
            "conversion_rate": control_rate,
            "ci_lower": max(0, ci_control_lower),
            "ci_upper": min(1, ci_control_upper)
        },
        "variation": {
            "sample_size": variation_size,
            "conversions": variation_conversions,
            "conversion_rate": variation_rate,
            "ci_lower": max(0, ci_variation_lower),
            "ci_upper": min(1, ci_variation_upper)
        },
        "difference": {
            "absolute": absolute_difference,
            "relative": relative_difference,
            "ci_lower": ci_lower,
            "ci_upper": ci_upper
        },
        "statistical_tests": {
            "chi_square": {
                "statistic": chi2,
                "p_value": p_chi2,
                "degrees_of_freedom": dof
            },
            "z_test": {
                "z_score": z_score,
                "p_value": p_value_z
            }
        },
        "effect_size": {
            "cohens_h": h,
            "interpretation": effect_size_interpretation
        },
        "results": {
            "is_significant": is_significant,
            "confidence_level": 95,
            "recommended_sample_size": recommended_sample if not is_significant else 0
        }
    }
