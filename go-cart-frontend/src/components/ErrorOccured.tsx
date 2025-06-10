function ErrorOccured() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-2">
        Oops! Something went wrong.
      </h1>
      <p className="text-gray-500 text-lg">
        An error occurred. Please try again later.
      </p>
    </div>
  );
}

export default ErrorOccured;
