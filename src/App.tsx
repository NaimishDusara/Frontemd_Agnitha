import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CreatePaste } from './components/CreatePaste';
import { ViewPaste } from './components/ViewPaste';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-xl font-bold text-gray-900">
                  PasteBin Lite
                </span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="py-10 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<CreatePaste />} />
            <Route path="/p/:id" element={<ViewPaste />} />
          </Routes>
        </main>

        <footer className="mt-auto py-6 text-center text-gray-600 text-sm">
          <p>© 2024 PasteBin Lite. Built with React, TypeScript & Tailwind CSS</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;