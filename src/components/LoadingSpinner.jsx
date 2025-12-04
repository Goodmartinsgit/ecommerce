const LoadingSpinner = ({ fullScreen = false, size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-4",
  };

  const spinner = (
    <div
      className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-primary font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        {spinner}
        <p className="text-primary font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
