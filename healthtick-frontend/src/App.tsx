import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from "./Components/Calendar";
// import BookCallForm from './Components/BookCallForm';
import { createContext, useState } from "react";
import { format } from "date-fns";

// eslint-disable-next-line react-refresh/only-export-components
export const DateContext = createContext<{
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}>({
  selectedDate: "",
  setSelectedDate: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const OpenContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});


function App() {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      <OpenContext.Provider value={{ open, setOpen }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Calendar />} />
          {/* <Route path="/" element={<BookCallForm />} /> */}
        </Routes>
        </BrowserRouter>
      </OpenContext.Provider>
    </DateContext.Provider>
  );
}

export default App;
