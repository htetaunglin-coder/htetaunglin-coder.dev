import * as yup from "yup";

export const messageSchema = yup.object({
  name: yup
    .string()
    .required("Please enter your name")
    .min(3, "Name should be between 3 and 30 characters")
    .max(30, "Name should be between 3 and 30 characters"),
  email: yup
    .string()
    .email("Invalid Email")
    .required("Please enter your email"),
  message: yup
    .string()
    .required("Please enter your message")
    .min(5, "Message should be between 5 and 80 characters")
    .max(80, "Message should be between 5 and 80 characters"),
});
