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

export const userRegisterSchema = (body) => {
  const errors = [];
  if (!isString(body.name) || body.name.trim().length < 2) {
    errors.push("name must be at least 2 characters");
  }
  if (!isString(body.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("valid email is required");
  }
  if (!isString(body.password) || body.password.length < 6) {
    errors.push("password must be at least 6 characters");
  }
  return errors;
};

export const userLoginSchema = (body) => {
  const errors = [];
  if (!isString(body.email) || !body.email.trim()) errors.push("email is required");
  if (!isString(body.password) || !body.password.trim()) errors.push("password is required");
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
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("items must be a non-empty array");
  }
  if (typeof body.total !== "number" || body.total < 0) {
    errors.push("total must be a positive number");
  }
  return errors;
};
