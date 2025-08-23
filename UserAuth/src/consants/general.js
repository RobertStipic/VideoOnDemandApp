export const constants = {
  status: {
    succeeded: "succeeded",
    cancelled: "cancelled",
    failed: "failed",
    pending: "pending",
  },
  genderArray: ["Male", "Female", "Other"],
  activity: {
    registration: "registration",
    login: "login",
  },
  cookieAge : 12 * 60 * 60 * 1000,
};
export const constantsRoutes = {
  password: "password",
  passwordMessage: "Please enter password",
  email: "email",
  emailMessage: "Email must be valid",
};

export const constantsChangePassword = {
  newPassword: "newPassword",
  newPasswordMessage: "Please supply new password",
  confirmNewPassword: "confirmNewPassword",
  confirmNewPasswordMessage: "Please confirm new password",
};

export const constantsSignUP = {
  passwordTypeMessage: "Password should be string",
  passwordLengthMessage: "Password must be between 8 and 20 characters",
  firstName: "firstName",
  firstNameMessage: "Please enter firstname",
  firstNameValidMessage: "first name is not valid(only characters)",
  lastName: "lastName",
  lastNameMessage: "Please enter lastname",
  lastNameValidMessage: "first name is not valid(only characters)",
  dateOfBirth: "dateOfBirth",
  dateOfBirthMessage: "Please provide Date of Birth",
  dateOfBirthFormatMessage: "Date format must be: YYYY-MM-DD",
  country: "country",
  countryMessage: "Please provide valid 2 letter ISO 3166-1 Country code",
  city: "city",
  cityMessage: "City name is not valid(only characters)",
  gender: "gender",
  genderMessage: "Please provide gender",
  genderValidMessage: "Valid gender values: Male,Female,Other",
};
