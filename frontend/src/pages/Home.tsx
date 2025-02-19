import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen  ">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Master Your Coding Skills
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Practice coding problems, track your progress, and improve your algorithmic thinking
          </p>
          <Link to="/problems">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg">
              Start Coding Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Diverse Problem Set
            </h3>
            <p className="text-gray-300">
              Practice with a wide range of coding challenges across different difficulty levels
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Real-time Feedback
            </h3>
            <p className="text-gray-300">
              Get instant feedback on your solutions with our advanced code evaluation system
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Track Progress
            </h3>
            <p className="text-gray-300">
              Monitor your improvement and compare your rankings with other developers
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Level Up Your Coding Skills?
          </h2>
          <div className="space-x-4">
            <Link to="/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                Sign Up Free
              </Button>
            </Link>
            <Link to="/problems">
              <Button variant="outline" className="text-white border-white hover:bg-gray-700">
                Browse Problems
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
