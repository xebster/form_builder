import * as z from 'zod';

export const generateValidationSchema = (elements) => {
  const schema = elements.reduce((acc, el) => {
    if (el.validation.required) {
      acc[el.label] = z.string().min(1, `${el.label} is required`);
    }
    return acc;
  }, {});

  return z.object(schema);
};
