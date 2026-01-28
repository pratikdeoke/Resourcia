export const successResponse = (data = null, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

export const errorResponse = (message = 'Something went wrong', errors = null) => {
  return {
    success: false,
    message,
    errors
  };
};