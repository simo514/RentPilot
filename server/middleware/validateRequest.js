export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors });
    }

    next();
  };
};

/**
 * Parses the JSON string in req.body.data (sent by multipart/form-data requests)
 * and merges the result back into req.body so subsequent validation and
 * controller code can access fields directly on req.body.
 */
export const parseMultipartData = (req, res, next) => {
  if (typeof req.body?.data === 'string') {
    try {
      const parsed = JSON.parse(req.body.data);
      // Preserve any other body fields (unlikely in multipart, but safe)
      req.body = { ...parsed };
    } catch {
      return res.status(400).json({ error: 'Invalid JSON in multipart data field' });
    }
  }
  next();
};
