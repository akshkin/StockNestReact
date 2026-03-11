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

export const groupCategorySchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be less than 100 characters"),
});

export const inviteMemberSchema = z.object({
	email: z.string().email("Invalid email address"),
	role: z.enum(["Viewer", "Member", "Co-Owner"], {
		message: "Role must be either Viewer or Member",
	}),
});

export const itemSchema = z.object({
	name: z
		.string()
		.min(2, "Item name must be at least 2 characters")
		.max(100, "Item name must be less than 100 characters"),
	quantity: z
		.number()
		.nonnegative("Quantity must be 0 or more")
		.min(0, "Quantity cannot be less than zero")
		.max(9999, "Quantity cannot be more than 9999"),
});

export const profileSchema = z.object({
	firstName: z
		.string()
		.min(2, "First name must be at least 2 characters")
		.max(100, "First name must be less than 100 characters"),
	lastName: z
		.string()
		.min(2, "Last name must be at least 2 characters")
		.max(100, "Last name must be less than 100 characters"),
});
