import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/Layout/AppShell';
import { HomePage } from './pages/HomePage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { AdminBlogEditor } from './pages/admin/AdminBlogEditor';
import {ProtectedRoute} from './components/Layout/ProtectedRoute';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
                <Route path="/admin/signin" element={<SignIn />} />
                <Route path="/admin/signup" element={<SignUp />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
               <Route path="/admin/blog/new" element={<ProtectedRoute><AdminBlogEditor /></ProtectedRoute>} />
               <Route path="/admin/blog/edit/:id" element={<ProtectedRoute><AdminBlogEditor /></ProtectedRoute>} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
