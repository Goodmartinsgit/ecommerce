import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PageTransitionLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <div className="h-full bg-primary animate-progress-bar" />
    </div>
  );
};

export default PageTransitionLoader;
