export default function validateObject(obj, rules){
  let errors = {};

  const required = (field, value) => {
    console.log('value', value);
    return ((!value && value !== 0) || value === '') ? [`${field} is required`] : [];
  }

  const minLength = (field, value, min) => {
    if(typeof value === 'string' || !value)
      return (value.length < min) ? [`${field} cannot be less than ${min} characters`] : [];
    console.warn(`minLength: Expected string for value, received ${typeof value} (${value}) ||  max (${min}) is undefined?`)
    return []
  }
  const maxLength = (field, value, max) => {
    if(typeof value === 'string' || !value)
      return (value.length > max) ? [`${field} cannot be more than ${max} characters`] : [];
    console.warn(`maxLength: Expected string for value, received ${typeof value} (${value}) ||  max (${max}) is undefined?`)
    return []
  }

  const min = (field, value, min) => {
    if(typeof value === 'number')
      return (value < min) ? [`${field} cannot be less than ${min}`] : []
    console.warn(`maxLength: Expected number for value, received ${typeof value} (${value}) ||  min (${min}) is undefined?`)
    return []
  }

  const max = (field, value, max) => {
    if(typeof value === 'number' && max)
      return (value > max) ? [`${field} cannot be more than ${max}`] : []
    console.warn(`maxLength: Expected number for value, received ${typeof value} (${value}) ||  max (${max}) is undefined?`)
    return []
  }

  const rulesOptions = {
    'required': required,
    'minLength': minLength,
    'maxLength': maxLength,
    'min': min,
    'max': max
  };
  if(typeof obj !== 'object') {
    console.warn(`Expected object for validation, received ${typeof obj}`)
    return {errors: []}
  }
  for(const [key, value] of Object.entries(rules)){
    let fieldErrors = []
    for(const validation of value){
      const validationInfo = validation.split(":");
      if(validationInfo.length === 1)
        fieldErrors = fieldErrors.concat(rulesOptions[validationInfo[0]](key, obj[key]))
      if(validationInfo.length === 2)
        fieldErrors = fieldErrors.concat(rulesOptions[validationInfo[0]](key, obj[key], validationInfo[1]))
    }
    errors[key] = fieldErrors;
  }
  return errors;
}