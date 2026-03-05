import z from "zod";

export const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string(),
});

export const registerSchema = z.object({
	firstName: z
		.string()
		.min(2, "First name must be at least 2 characters")
		.max(100, "First name must be less than 100 characters"),
	lastName: z
		.string()
		.min(2, "Last name must be at least 2 characters")
		.max(100, "Last name must be less than 100 characters"),
	emailAddress: z.string().email("Invalid email"),
	password: z
		.string()
		.min(6)
		.regex(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{6,}$/,
			"Password must be at least 6 characters and contain both letters and numbers and one special character",
		),
});
// .refine((data) => data.password === data.confirmPassword, {
// 	message: "Passwords do not match",
// 	path: ["confirmPassword"],
// });
