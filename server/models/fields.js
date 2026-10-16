export const text = { type: String, required: true, trim: true, maxlength: 200 };
export const email = { type: String, required: true, trim: true, lowercase: true, maxlength: 254, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ };
export const portfolioFields = {
  title: text, firstname: text, lastname: text, email,
  completion: { type: Date, required: true },
  description: { ...text, maxlength: 5000 }
};
