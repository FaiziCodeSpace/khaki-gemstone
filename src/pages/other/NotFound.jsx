

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
            <div className="text-center">
                {/* Big Error Code */}
                <h1 className="text-9xl font-black text-[#CA0A75] opacity-20">
                    404
                </h1>

                {/* Descriptive Text */}
                <div className="relative -mt-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Lost in space?
                    </h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                    The page you're looking for doesn't exist or has been moved.
                    Don't worry, we can help you find your way back.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                    href="/"
                    className="px-8 py-3 bg-[#CA0A75] text-white font-semibold rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300"
                >
                    Go Home
                </a>
                <button
                    onClick={() => window.history.back()}
                    className="px-8 py-3 bg-white text-[#CA0A75] border-2 border-[#CA0A75] font-semibold rounded-lg hover:bg-[#CA0A75] hover:text-white transition-all duration-300"
                >
                    Go Back
                </button>
            </div>
        </div>
    </div>
  );
};

