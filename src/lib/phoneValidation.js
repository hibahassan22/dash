/** أقصى طول لرقم جوال سعودي محلي (05xxxxxxxx) */
export const SAUDI_PHONE_MAX_LEN = 10;

/** يبقي أرقاماً فقط ويحدّ الطول */
export function sanitizePhoneInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.slice(0, SAUDI_PHONE_MAX_LEN);
}

/**
 * تحقق من رقم جوال سعودي:
 * - 10 أرقام تبدأ بـ 05
 * - أو 9 أرقام تبدأ بـ 5
 */
export function validatePhone(phone) {
  const digits = sanitizePhoneInput(phone);

  if (!digits) {
    return { valid: false, message: "رقم الهاتف مطلوب" };
  }

  if (digits.length < 9) {
    return { valid: false, message: "رقم الهاتف قصير جداً" };
  }

  if (digits.length === 10) {
    if (!digits.startsWith("05")) {
      return { valid: false, message: "الرقم المحلي يجب أن يبدأ بـ 05" };
    }
    return { valid: true, normalized: digits };
  }

  if (digits.length === 9) {
    if (!digits.startsWith("5")) {
      return { valid: false, message: "رقم الجوال يجب أن يبدأ بـ 5" };
    }
    return { valid: true, normalized: `0${digits}` };
  }

  return {
    valid: false,
    message: `رقم الهاتف يجب أن يكون 9 أو ${SAUDI_PHONE_MAX_LEN} أرقام`,
  };
}

/** تحقق صارم: 10 أرقام محلية تبدأ بـ 05 */
export function validatePhoneTenDigits(phone) {
  const digits = sanitizePhoneInput(phone);

  if (!digits) {
    return { valid: false, message: "رقم الهاتف مطلوب" };
  }

  if (digits.length !== SAUDI_PHONE_MAX_LEN) {
    return { valid: false, message: `رقم الهاتف يجب أن يكون ${SAUDI_PHONE_MAX_LEN} أرقام` };
  }

  if (!digits.startsWith("05")) {
    return { valid: false, message: "الرقم يجب أن يبدأ بـ 05" };
  }

  return { valid: true, normalized: digits };
}

/** يحوّل رقم API (+966…) إلى 10 أرقام محلية */
export function normalizeSaudiPhoneFromApi(phone) {
  let digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.startsWith("966")) digits = digits.slice(3);
  if (digits.length === 9 && digits.startsWith("5")) digits = `0${digits}`;
  return sanitizePhoneInput(digits);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(email) {
  const value = String(email ?? "").trim();
  if (!value) return { valid: false, message: "البريد الإلكتروني مطلوب" };
  if (!EMAIL_RE.test(value)) {
    return { valid: false, message: "أدخل بريداً إلكترونياً صحيحاً" };
  }
  return { valid: true, normalized: value.toLowerCase() };
}

export const SAUDI_IBAN_DIGITS = 22;

export function sanitizeIbanInput(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, SAUDI_IBAN_DIGITS);
}

export function validateSaudiIban(iban) {
  const digits = sanitizeIbanInput(iban);
  if (!digits) return { valid: false, message: "رقم الآيبان مطلوب" };
  if (digits.length !== SAUDI_IBAN_DIGITS) {
    return { valid: false, message: `الآيبان يجب أن يكون ${SAUDI_IBAN_DIGITS} رقماً` };
  }
  return { valid: true, normalized: `SA${digits}`, digits };
}
