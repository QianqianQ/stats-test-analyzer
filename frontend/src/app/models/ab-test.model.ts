export interface AbTestInput {
  control_size: number;
  control_conversions: number;
  variation_size: number;
  variation_conversions: number;
}

export interface AbTestResults {
  control: {
    sample_size: number;
    conversions: number;
    conversion_rate: number;
    ci_lower: number;
    ci_upper: number;
  };
  variation: {
    sample_size: number;
    conversions: number;
    conversion_rate: number;
    ci_lower: number;
    ci_upper: number;
  };
  difference: {
    absolute: number;
    relative: number;
    ci_lower: number;
    ci_upper: number;
  };
  statistical_tests: {
    chi_square: {
      statistic: number;
      p_value: number;
      degrees_of_freedom: number;
    };
    z_test: {
      z_score: number;
      p_value: number;
    };
    fishers_exact: {
      odds_ratio: number;
      p_value: number;
      test_name: string;
      description: string;
    };
    chi2_contingency: {
      statistic: number;
      p_value: number;
      degrees_of_freedom: number;
      cramers_v: number;
      test_name: string;
      description: string;
    };
    barnards_exact: {
      p_value: number;
      pooled_rate: number;
      test_name: string;
      description: string;
    };
    g_test: {
      statistic: number;
      p_value: number;
      degrees_of_freedom: number;
      test_name: string;
      description: string;
    };
  };
  effect_size: {
    cohens_h: number;
    interpretation: string;
  };
  results: {
    is_significant: boolean;
    confidence_level: number;
    recommended_sample_size: number;
  };
}