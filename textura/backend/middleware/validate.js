const isString = (v) => typeof v === "string";

export const validate = (schema) => (req, res, next) => {
  const errors = schema(req.body || {});
  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
  return next();
};

export const authTokenSchema = (body) => {
  const errors = [];
  if (!isString(body.token) || !body.token.trim()) {
    errors.push("token is required");
  }
  return errors;
};

export const profileUpdateSchema = (body) => {
  const errors = [];
  const optionalFields = ["name", "phone", "address", "state", "district", "pincode", "landmark"];
  optionalFields.forEach((field) => {
    if (body[field] !== undefined && !isString(body[field])) {
      errors.push(`${field} must be a string`);
    }
  });
  if (body.pincode && !/^\d{5,6}$/.test(body.pincode)) {
    errors.push("pincode must be 5 or 6 digits");
  }
  return errors;
};

export const orderCreateSchema = (body) => {
  const errors = [];
  if (!isString(body.customerName) || body.customerName.trim().length < 2) {
    errors.push("customerName is required");
  }
  if (!isString(body.customerEmail) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail)) {
    errors.push("valid customerEmail is required");
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("items must be a non-empty array");
  }
  if (typeof body.total !== "number" || body.total < 0) {
    errors.push("total must be a positive number");
  }
  return errors;
};
