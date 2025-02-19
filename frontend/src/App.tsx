import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Layout } from './components/shared/Layout';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { Toaster } from "react-hot-toast";
import { AuthProvider } from './context/AuthProvider';
import { Problems } from './pages/Problems';
import { ProblemPage } from './pages/problem/Main';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <ThemeProvider> */}
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={
                    <Home />
                } />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="problems" element={<Problems />} />
                <Route path="problems/:slug" element={<ProblemPage />} />
                <Route path="folder/:folderId" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
            <Toaster />
          </AuthProvider>
        {/* </ThemeProvider> */}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
