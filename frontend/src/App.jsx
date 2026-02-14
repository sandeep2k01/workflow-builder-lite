import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WorkflowBuilder from './components/WorkflowBuilder';
import HistoryPage from './components/HistoryPage';
import StatusPage from './components/StatusPage';

export default function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<WorkflowBuilder />} />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="/status" element={<StatusPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
