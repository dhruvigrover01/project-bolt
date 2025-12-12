import { Search, BarChart3, Link2, Rocket } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Browse Strategies',
      description: 'Explore hundreds of verified algorithmic trading strategies with transparent performance metrics.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: BarChart3,
      title: 'Compare Performance',
      description: 'Analyze ROI, Sharpe ratios, win rates, and risk metrics to find strategies that match your goals.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Link2,
      title: 'Connect Broker API',
      description: 'Securely link your brokerage account via API for seamless automated trade execution.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Rocket,
      title: 'Start Auto-Trading',
      description: 'Activate your chosen strategy and let it trade automatically based on proven algorithms.',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with algorithmic trading in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 mt-4 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
