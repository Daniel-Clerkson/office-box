import { useState } from 'react';

const useFormValidator = () => {
	const [errors, setErrors] = useState({});

	const validateName = (name) => {
		if (!name.trim()) {
			return 'Name is required';
		}
		return '';
	};

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return 'Please enter a valid email address';
		}
		return '';
	};

	const validateSeats = (numOfSeats) => {
		if (numOfSeats <= 0) {
			return 'Number of seats must be greater than 0';
		}
		return '';
	};

	const validateDateTimePicker = (dateTime) => {
		if (!dateTime) {
			return 'Date and time must be selected';
		}

		const selectedDate = new Date(dateTime);
		const currentDate = new Date();

		if (selectedDate < currentDate) {
			return 'Selected date and time must be in the future';
		}

		return '';
	};

	const validateForm = (formData) => {
		const errors = {
			fullname: validateName(formData.fullname),
			email: validateEmail(formData.email),
			numOfSeats: validateSeats(formData.numOfSeats),
			date: validateDateTimePicker(formData.date),
		};

		setErrors(errors);

		return Object.values(errors).every((error) => error === '');
	};

	return { errors, validateForm };
};

export default useFormValidator;
