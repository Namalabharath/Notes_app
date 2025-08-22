import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Notes/home";
import Reminder from "./routes/Reminder/Reminder";
import AddNote from "./routes/Notes/add-note";
import UpdateNote from "./routes/Notes/EditNote";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AINotesGenerator from "./components/AINotesGenerator";

function App() {
  return (
    <>
      <Router>
      
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-note" element={<AddNote />} />
          <Route path="/note/:id" element={<UpdateNote />} />
          <Route path="/ai-generate" element={<AINotesGenerator />} />
          <Route path="/about" element={<Reminder />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
