import { createTheme, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/Layout/AppShell';
import { HomePage } from './pages/HomePage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { AdminBlogEditor } from './pages/admin/AdminBlogEditor';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { UnpublishedBlogs } from './pages/admin/UnpublishedBlogs';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import '@mantine/tiptap/styles.css';
import { BlogEditor } from './pages/admin/BlogEditor';

const queryClient = new QueryClient();
const theme = createTheme({
  primaryColor: 'blue',
  // You can customize other theme properties here
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="dark" theme={{ colorScheme: theme }}>
        <Notifications />
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage/>} />
                <Route path="/admin/signin" element={<SignIn />} />
                <Route path="/admin/signup" element={<SignUp />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
               <Route 
                 path="/admin/blog/new" 
                 element={<ProtectedRoute requiredRole="ADMIN"><BlogEditor /></ProtectedRoute>} 
               />
               <Route 
                 path="/admin/blog/edit/:id" 
                 element={<ProtectedRoute requiredRole="ADMIN"><BlogEditor /></ProtectedRoute>} 
               />
               <Route 
                 path="/admin/blogs/unpublished" 
                 element={<ProtectedRoute requiredRole="ADMIN"><UnpublishedBlogs /></ProtectedRoute>} 
               />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
