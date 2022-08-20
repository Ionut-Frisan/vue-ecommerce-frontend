export default function validateObject(obj, rules){
  let errors = {};

  const required = (field, value) => {
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

  const isEmail = (field, value) => {
    const valid = !!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    if(!valid) return ['Please enter a valid email']
    return []
  }

  const rulesOptions = {
    'required': required,
    'minLength': minLength,
    'maxLength': maxLength,
    'min': min,
    'max': max,
    'isEmail': isEmail
  };
  if(typeof obj !== 'object') {
    console.warn(`Expected object for validation, received ${typeof obj}`)
    return {errors: []}
  }
  for(const [key, value] of Object.entries(rules)){
    let valueCopy = [...value];
    const hasCustomName = valueCopy.some((item) => item.includes('showAs'));
    let showAs;
    if(hasCustomName){
      valueCopy.forEach((item) => {
        if(item.includes('showAs')) {
          showAs = item.split(':')[1];
          let index = valueCopy.indexOf(item);
          if (index !== -1) {
            valueCopy.splice(index, 1);
          }
        }
      })
    }
    if(!showAs) showAs = key;
    let fieldErrors = []
    for(const validation of valueCopy){
      const validationInfo = validation.split(":");
      if(validationInfo.length === 1)
        fieldErrors = fieldErrors.concat(rulesOptions[validationInfo[0]](showAs, obj[key]))
      if(validationInfo.length === 2)
        fieldErrors = fieldErrors.concat(rulesOptions[validationInfo[0]](showAs, obj[key], validationInfo[1]))
    }
    errors[key] = fieldErrors;
  }
  return errors;
}