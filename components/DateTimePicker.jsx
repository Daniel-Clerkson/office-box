"use client"

// Make selectedDate and SetSelectedDate as props
const DateTimePicker = ({ selectedDate, handleDateChange }) => {
	return (
		<div className="">
			<input
				type="datetime-local"
				className="border rounded-lg px-3 py-2"
				onChange={(e) => handleDateChange(e.target.value)}
				value={selectedDate || ''}
			/>
		</div>
	);
};

export default DateTimePicker;
