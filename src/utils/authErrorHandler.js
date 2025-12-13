

export const getAuthErrorMessage = (error) => {
  if (!error || !error.code) return "Something went wrong. Please try again.";

  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Try again.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    default:
      return "Authentication failed. Please try again.";
  }
};
