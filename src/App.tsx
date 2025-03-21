import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui";

import './App.css'
import LessonViewerPage from './pages/LessonViewerPage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LessonViewerPage />
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
