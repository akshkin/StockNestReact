import ErrorText from "../errorText/ErrorText";
import styles from "./inputField.module.scss";

type Props = {
	label: string;
	name: string;
	type?: string;
	value: string;
	placeholder: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
};

export default function InputField({
	label,
	name,
	type = "text",
	value,
	placeholder,
	onChange,
	error,
}: Props) {
	return (
		<div className={styles.wrapper}>
			<label htmlFor={name}>{label}</label>
			<input
				id={name}
				name={name}
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
			/>
			{error && <ErrorText error={error} />}
		</div>
	);
}
