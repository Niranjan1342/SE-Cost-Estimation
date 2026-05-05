/**
 * Validates prediction input based on specific rules.
 */
const validatePredictionInput = (data) => {
  const {
    size,
    modules,
    integration,
    tech_stack,
    reusability,
    team,
    complexity,
  } = data;

  const errors = [];

  if (size === undefined || typeof size !== 'number' || size <= 0) {
    errors.push('Size must be a number greater than 0');
  }

  if (modules === undefined || typeof modules !== 'number' || modules <= 0) {
    errors.push('Modules must be a number greater than 0');
  }

  if (team === undefined || typeof team !== 'number' || team < 1 || team > 50) {
    errors.push('Team must be a number between 1 and 50');
  }

  if (reusability === undefined || typeof reusability !== 'number' || reusability < 0 || reusability > 100) {
    errors.push('Reusability must be a number between 0 and 100');
  }

  const validIntegration = ['low', 'medium', 'high'];
  if (!validIntegration.includes(integration)) {
    errors.push('Integration must be low, medium, or high');
  }

  const validComplexity = ['low', 'medium', 'high'];
  if (!validComplexity.includes(complexity)) {
    errors.push('Complexity must be low, medium, or high');
  }

  const validTechStack = ['web', 'mobile', 'ai'];
  if (!validTechStack.includes(tech_stack)) {
    errors.push('Tech stack must be web, mobile, or ai');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return { isValid: true };
};

module.exports = {
  validatePredictionInput,
};
