import { useState } from "react";
import { useLoginMutation } from "../../api/authApi";
import z from "zod";
import { loginSchema } from "../../schemas";
import InputField from "../../components/inputField/InputField";
import styles from "./auth.module.scss";
import { extractErrorMessage, zodErrorsToObject } from "../../helpers/utils";
import ErrorText from "../../components/errorText/ErrorText";
import { Link, useLocation, useNavigate } from "react-router-dom";

type loginScehma = z.infer<typeof loginSchema>;

function Login() {
	const [data, setData] = useState<loginScehma>({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof loginScehma, string>>
	>({});

	const navigate = useNavigate();
	const location = useLocation();
	const message = location.state?.message || "";

	const isFormValid =
		Object.keys(errors).length === 0 && data.email && data.password;

	const [login, { isLoading, error, reset }] = useLoginMutation();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		reset(); //reset the error from rtk query when user starts typing
		const newData = { ...data, [e.target.name]: e.target.value };
		setData(newData);

		const result = loginSchema.safeParse(newData);

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
			const response = await login(data).unwrap();
			if (response?.user) {
				await new Promise((resolve) => setTimeout(resolve, 200)); // Add a delay of 0.2 seconds
				navigate("/dashboard", { replace: true });
			}
			console.log(response);
		} catch (err) {
			console.error("Login failed", err);
		} finally {
			setData({
				email: "",
				password: "",
			});
		}
	}

	return (
		<div className={styles.container}>
			{message && <ErrorText error={message} />}

			<h1 className={styles.title}>Login</h1>
			<form>
				<InputField
					label="Email Address"
					name="email"
					type="text"
					placeholder="Email"
					value={data.email}
					onChange={(e) => handleChange(e)}
					error={errors?.email}
				/>
				<InputField
					label="Password"
					name="password"
					type="password"
					placeholder="Password"
					value={data.password}
					onChange={(e) => handleChange(e)}
					error={errors?.password}
				/>

				<button
					className={styles.button}
					type="submit"
					onClick={(e) => handleSubmit(e)}
					disabled={isLoading || !isFormValid}
				>
					Login
				</button>
				{error && <ErrorText error={extractErrorMessage(error)} />}
			</form>
			<Link to="/register">Not a member? Register here</Link>
		</div>
	);
}

export default Login;
