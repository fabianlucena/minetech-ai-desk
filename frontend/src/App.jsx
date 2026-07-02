import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useRoutes } from './routes.jsx';

export default function App() {
  const routes = useRoutes();
  const router = createBrowserRouter(routes);

  return <RouterProvider
    router={router}
    future={{
      v7_startTransition: true,
    }}
  />;
}