import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import Styled from "styled-components"
import { format, isSameDay, parseISO } from 'date-fns';
import ja from 'date-fns/locale/ja';
import { useRouter } from 'next/router';
import axiosInstance from '@/libs/axiosInstance';

const Container = Styled.div`
  // margin-top: 50px;
`

const Today = Styled.div`
  background-color: #fff;
  border: 1px solid #dadadd;
  border-radius: 0.3rem;
  display: block;
  width: 100%;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 14px;
  padding: 7px 8px;
  font-family: "HiraginoKakuGothicProN-W6";
`

interface DateSelectorProps {
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateChange }) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    if (selectedDate) {
      fetchData(selectedDate);
    }
  }, [selectedDate]);

  const handleMonthChange = (date: Date | null) => {
    if (date) {
      fetchData(date);
    }
  };

  const handleDateChange = (date:any) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const fetchData = async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM', { locale: ja });
    try {
      const response = await axiosInstance.get(`/web/1.0/posts/folders/days?month=${formattedDate}`);
      if (response.data.code === 'S200_01') {
        const responseData = response.data.data;
        const dataArray = Object.values(responseData);
        setData(dataArray);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        router.push('/500');
      }
    }
  };

  const dayClassNames = (date: Date) => {
    const day = date.getDate();
    return isDateInData(day) ? 'highlight' : '';
  };

  const isDateInData = (day: number) => {
    return data.includes(day);
  };

  const customDateFormat = (date: Date) => {
    return format(date, 'yyyy年M月dd日', { locale: ja });
  };

  const CustomDatePicker = ({ value, onClick }: any) => (
    <button onClick={onClick}>{customDateFormat(value)}</button>
  );

  return (
    <Container>
      <Today onClick={() => handleDateChange(new Date())}>{format(new Date(), 'yyyy年M月dd日', { locale: ja })}</Today>
      <DatePicker
        inline
        selected={selectedDate}
        onChange={handleDateChange}
        onMonthChange={handleMonthChange}
        dayClassName={dayClassNames}
        locale={ja}
        dateFormatCalendar={"yyyy年M月"}
        customInput={<CustomDatePicker />}
      />
    </Container>
  );
};

export default DateSelector;
