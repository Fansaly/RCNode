const stringToArray = (str: string) => {
  if (typeof str !== 'string') {
    throw new Error("the parameter is not of type `string'.");
  }
  return str.trim().replace(/\s+/g, ' ').split(/[\s,]/);
};

export const pick = (data: any, fields?: string | string[]) => {
  fields = Array.isArray(fields)
    ? fields
    : typeof fields === 'string'
      ? stringToArray(fields)
      : [];

  if (!data || typeof data !== 'object' || fields.length === 0) {
    return {};
  }

  const hasOwnProperty = Object.prototype.hasOwnProperty.bind(data);

  return fields.reduce(
    (acc, key) => ({
      ...acc,
      ...(hasOwnProperty(key) ? { [key]: data[key] } : {}),
    }),
    {},
  );
};

export const omit = (data: any, fields?: string | string[]) => {
  fields = Array.isArray(fields)
    ? fields
    : typeof fields === 'string'
      ? stringToArray(fields)
      : [];

  if (!data || typeof data !== 'object' || fields.length === 0) {
    return data || {};
  }

  data = { ...data };

  fields.forEach((key) => {
    delete data[key];
  });

  return data;
};
