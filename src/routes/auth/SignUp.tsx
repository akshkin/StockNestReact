import { useState } from "react";
import styles from "./auth.module.scss";
import { registerSchema } from "../../schemas";
import { z } from "zod";
import { useRegisterMutation } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/inputField/InputField";
import ErrorText from "../../components/errorText/ErrorText";
import { zodErrorsToObject } from "../../helpers/utils";

type registerSchema = z.infer<typeof registerSchema>;

const defaultData = {
	firstName: "",
	lastName: "",
	emailAddress: "",
	password: "",
};

function Auth() {
	const [data, setData] = useState<registerSchema>(defaultData);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState<
		Partial<Record<keyof typeof defaultData, string>>
	>({});

	const [register, registerState] = useRegisterMutation();

	const navigate = useNavigate();

	const isFormValid =
		Object.keys(errors).length === 0 &&
		Object.values(data).every((value) => value) &&
		confirmPassword;

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		registerState.reset(); //reset the error from rtk query when user starts typing
		const newData = { ...data, [e.target.name]: e.target.value };
		setData(newData);

		const result = registerSchema.safeParse(newData);

		if (!result.success) {
			const formErrors = zodErrorsToObject(result.error);
			setErrors(formErrors);
			return;
		} else {
			setErrors({});
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			const response = await register(data);
			if (response.data?.user) {
				navigate("/dashboard", {
					replace: true,
					state: {
						message:
							"We are glad that you signed up and cannot wait for you to start using our platform!",
					},
				});
			}
			console.log(response);
		} catch (err) {
			console.error("Registration failed", err);
		} finally {
			setData(defaultData);
			setConfirmPassword("");
		}
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Register</h1>
			<form>
				<InputField
					label="First Name"
					placeholder="First Name"
					name="firstName"
					value={data.firstName}
					onChange={(e) => handleChange(e)}
					error={errors.firstName}
					type="text"
				/>

				<InputField
					label="Last Name"
					placeholder="Last Name"
					name="lastName"
					value={data.lastName}
					onChange={(e) => handleChange(e)}
					error={errors.lastName}
					type="text"
				/>

				<InputField
					label="Email Address"
					placeholder="Email Address"
					name="emailAddress"
					value={data.emailAddress}
					onChange={(e) => handleChange(e)}
					error={errors.emailAddress}
				/>

				<InputField
					label="Password"
					placeholder="Password"
					name="password"
					value={data.password}
					onChange={(e) => handleChange(e)}
					type="password"
					error={errors.password}
				/>

				<InputField
					label="Confirm Password"
					name="confirmPassword"
					type="password"
					placeholder="Confirm Password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					error={
						confirmPassword && confirmPassword !== data.password
							? "Passwords do not match"
							: undefined
					}
				/>

				<button
					disabled={!isFormValid}
					type="submit"
					onClick={(e) => handleSubmit(e)}
					className={styles.button}
				>
					Register
				</button>
				{registerState.error && (
					<ErrorText
						error={
							"data" in registerState.error
								? registerState.error?.data?.toString()
								: "An error occurred while registering"
						}
					/>
				)}
			</form>
		</div>
	);
}

export default Auth;
