import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { addDays, startOfWeek, format, addWeeks } from "date-fns";

const WeeklyCalendar = ({ selectedDate, onDateSelect }) => {
    const [weekStartDate, setWeekStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [showCalendar, setShowCalendar] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0); // 0 = current week

    const handleNextWeek = () => {
        setWeekOffset(prev => prev + 1);
    };

    const handlePrevWeek = () => {
        if (weekOffset > 0) {
            setWeekOffset(prev => prev - 1);
        }
    };

    const getWeekDates = (offset = 0) => {
        const today = new Date();
        const baseDate = addDays(today, offset * 7);
        return Array.from({ length: 7 }, (_, i) => addDays(baseDate, i));
    };;

    const weekDates = getWeekDates(weekOffset);

    const handleDatePick = (date) => {
        onDateSelect(date);
        setWeekStartDate(startOfWeek(date, { weekStartsOn: 1 }));
        setShowCalendar(false);
    };

    return (
        <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
                {/* Left Arrow - show only if not current week */}
                {weekOffset > 0 && (
                    <i
                        className="bi bi-chevron-left fs-4 text-dark me-2"
                        role="button"
                        onClick={handlePrevWeek}
                    ></i>
                )}

                {/* Dates Row */}
                <div className="d-flex flex-wrap gap-2 justify-content-center flex-grow-1">
                    {weekDates.map((date) => {
                        const isSelected = format(date, "yyyy-MM-dd") === format(new Date(selectedDate), "yyyy-MM-dd");
                        return (
                            <button
                                key={date}
                                className={`btn ${isSelected ? "btn-danger" : "btn-outline-dark"} rounded-pill`}
                                onClick={() => onDateSelect(date)}
                            >
                                <div className="fw-bold">{format(date, "dd, MMM -  EEE")}</div>
                            </button>
                        );
                    })}
                </div>

                {/* Right arrow and calendar icon with spacing */}
                <div className="d-flex align-items-center ms-3 gap-3">
                    <i
                        className="bi bi-chevron-right fs-4 text-dark"
                        role="button"
                        onClick={handleNextWeek}
                    ></i>

                    <i
                        className="bi bi-calendar-event fs-4 text-dark"
                        role="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                    ></i>
                </div>
            </div>

            {/* Inline calendar */}
            {showCalendar && (
                <div className="d-flex justify-content-center mt-2" title="Calendar">
                    <DatePicker
                        selected={new Date(selectedDate)}
                        onChange={handleDatePick}
                        inline
                        minDate={new Date()}
                    />
                </div>
            )}
        </div>
    );
};

export default WeeklyCalendar;
