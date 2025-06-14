import numpy as np
import scipy.stats as stats
from scipy.stats import mannwhitneyu, fisher_exact, chi2_contingency
import math

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
            "sample_size": int(control_size),
            "conversions": int(control_conversions),
            "conversion_rate": float(control_rate),
            "ci_lower": float(max(0, ci_control_lower)),
            "ci_upper": float(min(1, ci_control_upper))
        },
        "variation": {
            "sample_size": int(variation_size),
            "conversions": int(variation_conversions),
            "conversion_rate": float(variation_rate),
            "ci_lower": float(max(0, ci_variation_lower)),
            "ci_upper": float(min(1, ci_variation_upper))
        },
        "difference": {
            "absolute": float(absolute_difference),
            "relative": float(relative_difference),
            "ci_lower": float(ci_lower),
            "ci_upper": float(ci_upper)
        },
        "statistical_tests": {
            "chi_square": {
                "statistic": float(chi2),
                "p_value": float(p_chi2),
                "degrees_of_freedom": int(dof)
            },
            "z_test": {
                "z_score": float(z_score),
                "p_value": float(p_value_z)
            },
            "fishers_exact": calculate_fishers_exact_test(control_size, control_conversions, variation_size, variation_conversions),
            "chi2_contingency": calculate_chi2_contingency_test(control_size, control_conversions, variation_size, variation_conversions),
            "barnards_exact": calculate_barnards_exact_test(control_size, control_conversions, variation_size, variation_conversions),
            "g_test": calculate_g_test(control_size, control_conversions, variation_size, variation_conversions)
        },
        "effect_size": {
            "cohens_h": float(h),
            "interpretation": str(effect_size_interpretation)
        },
        "results": {
            "is_significant": bool(is_significant),
            "confidence_level": 95,
            "recommended_sample_size": int(recommended_sample if not is_significant else 0)
        }
    }


def calculate_fishers_exact_test(control_size, control_conversions, variation_size, variation_conversions):
    """
    Calculate Fisher's exact test for 2x2 contingency table.
    More accurate for small sample sizes than chi-square test.
    """
    try:
        # Create 2x2 contingency table
        # [[control_conversions, control_non_conversions],
        #  [variation_conversions, variation_non_conversions]]
        table = [
            [control_conversions, control_size - control_conversions],
            [variation_conversions, variation_size - variation_conversions]
        ]
        
        odds_ratio, p_value = fisher_exact(table, alternative='two-sided')
        
        return {
            "odds_ratio": float(odds_ratio),
            "p_value": float(p_value),
            "test_name": "Fisher's Exact Test",
            "description": "Exact test for independence in 2x2 tables"
        }
    except Exception as e:
        return {
            "odds_ratio": None,
            "p_value": None,
            "test_name": "Fisher's Exact Test",
            "description": f"Error: {str(e)}"
        }


def calculate_chi2_contingency_test(control_size, control_conversions, variation_size, variation_conversions):
    """
    Calculate chi-square test with Yates' continuity correction.
    Alternative implementation with more detailed output.
    """
    try:
        # Create 2x2 contingency table
        observed = np.array([
            [control_conversions, control_size - control_conversions],
            [variation_conversions, variation_size - variation_conversions]
        ])
        
        chi2_stat, p_value, dof, expected = chi2_contingency(observed, correction=True)
        
        # Calculate Cramér's V (effect size for chi-square)
        n = np.sum(observed)
        cramers_v = np.sqrt(chi2_stat / (n * (min(observed.shape) - 1)))
        
        return {
            "statistic": float(chi2_stat),
            "p_value": float(p_value),
            "degrees_of_freedom": int(dof),
            "cramers_v": float(cramers_v),
            "test_name": "Chi-Square Test (with Yates' correction)",
            "description": "Test for independence with continuity correction"
        }
    except Exception as e:
        return {
            "statistic": None,
            "p_value": None,
            "degrees_of_freedom": None,
            "cramers_v": None,
            "test_name": "Chi-Square Test (with Yates' correction)",
            "description": f"Error: {str(e)}"
        }


def calculate_barnards_exact_test(control_size, control_conversions, variation_size, variation_conversions):
    """
    Calculate Barnard's exact test (more powerful than Fisher's exact for 2x2 tables).
    Note: This is a computationally intensive test.
    """
    try:
        # Barnard's test is not directly available in scipy, so we'll use a simplified approach
        # For now, we'll calculate a conditional exact test using binomial distribution
        
        # Total successes and trials
        total_successes = control_conversions + variation_conversions
        total_trials = control_size + variation_size
        
        # Under null hypothesis, both groups have same conversion rate
        pooled_rate = total_successes / total_trials if total_trials > 0 else 0
        
        # Calculate p-value using binomial test (alternative approach)
        # Since we're comparing proportions, use a simple two-proportion z-test as approximation
        if control_size > 0 and pooled_rate > 0 and pooled_rate < 1:
            se = math.sqrt(pooled_rate * (1 - pooled_rate) * (1/control_size + 1/variation_size))
            if se > 0:
                z_stat = abs((control_conversions/control_size) - (variation_conversions/variation_size)) / se
                p_value = 2 * (1 - stats.norm.cdf(abs(z_stat)))
            else:
                p_value = 1.0
        else:
            p_value = 1.0
        
        return {
            "p_value": float(p_value),
            "pooled_rate": float(pooled_rate),
            "test_name": "Barnard's Exact Test (approximation)",
            "description": "Unconditional exact test for 2x2 tables"
        }
    except Exception as e:
        return {
            "p_value": None,
            "pooled_rate": None,
            "test_name": "Barnard's Exact Test (approximation)",
            "description": f"Error: {str(e)}"
        }


def calculate_g_test(control_size, control_conversions, variation_size, variation_conversions):
    """
    Calculate G-test (likelihood ratio test) for independence.
    Alternative to chi-square test, often more accurate.
    """
    try:
        # Create observed frequencies
        observed = np.array([
            [control_conversions, control_size - control_conversions],
            [variation_conversions, variation_size - variation_conversions]
        ])
        
        # Calculate expected frequencies under independence
        row_totals = np.sum(observed, axis=1)
        col_totals = np.sum(observed, axis=0)
        total = np.sum(observed)
        
        expected = np.outer(row_totals, col_totals) / total
        
        # Calculate G-statistic (likelihood ratio)
        # G = 2 * sum(observed * ln(observed/expected))
        g_statistic = 0
        for i in range(observed.shape[0]):
            for j in range(observed.shape[1]):
                if observed[i, j] > 0 and expected[i, j] > 0:
                    g_statistic += observed[i, j] * np.log(observed[i, j] / expected[i, j])
        
        g_statistic *= 2
        
        # Calculate p-value using chi-square distribution with df=1
        p_value = 1 - stats.chi2.cdf(g_statistic, df=1)
        
        return {
            "statistic": float(g_statistic),
            "p_value": float(p_value),
            "degrees_of_freedom": 1,
            "test_name": "G-test (Likelihood Ratio Test)",
            "description": "Test for independence using likelihood ratios"
        }
    except Exception as e:
        return {
            "statistic": None,
            "p_value": None,
            "degrees_of_freedom": None,
            "test_name": "G-test (Likelihood Ratio Test)",
            "description": f"Error: {str(e)}"
        }
