import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Users, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface ROIData {
  currentGuests: number;
  averageStay: number;
  roomRate: number;
  checkinTime: number;
  currentSatisfaction: number;
  targetSatisfaction: number;
}

interface Results {
  currentRevenue: number;
  improvedRevenue: number;
  additionalRevenue: number;
  roi: number;
  paybackPeriod: number;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<ROIData>({
    currentGuests: 1000,
    averageStay: 2.5,
    roomRate: 150,
    checkinTime: 15,
    currentSatisfaction: 7.5,
    targetSatisfaction: 9.0
  });

  const [results, setResults] = useState<Results>({
    currentRevenue: 0,
    improvedRevenue: 0,
    additionalRevenue: 0,
    roi: 0,
    paybackPeriod: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const calculateROI = () => {
    const monthlyGuests = formData.currentGuests;
    const currentRevenue = monthlyGuests * formData.averageStay * formData.roomRate;
    
    // Improved metrics with PromptlyCheckin
    const satisfactionImprovement = (formData.targetSatisfaction - formData.currentSatisfaction) / 10;
    const checkinTimeReduction = Math.max(0, (formData.checkinTime - 3) / formData.checkinTime);
    
    // Revenue improvements
    const repeatGuestIncrease = satisfactionImprovement * 0.25; // 25% correlation
    const lengthOfStayIncrease = checkinTimeReduction * 0.15; // 15% correlation
    const rateOptimization = satisfactionImprovement * 0.1; // 10% rate optimization
    
    const improvedRevenue = currentRevenue * (1 + repeatGuestIncrease + lengthOfStayIncrease + rateOptimization);
    const additionalRevenue = improvedRevenue - currentRevenue;
    const annualAdditionalRevenue = additionalRevenue * 12;
    
    // Assuming PromptlyCheckin costs $2000/month
    const annualCost = 24000;
    const roi = ((annualAdditionalRevenue - annualCost) / annualCost) * 100;
    const paybackPeriod = annualCost / additionalRevenue;

    setResults({
      currentRevenue,
      improvedRevenue,
      additionalRevenue,
      roi,
      paybackPeriod
    });
  };

  useEffect(() => {
    calculateROI();
  }, [formData]);

  const handleInputChange = (field: keyof ROIData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <img src="/DataPlunge Logo.svg" alt="DataPlunge Logo" className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">ROI Calculator</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Calculate Your PromptlyCheckin ROI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how much additional revenue you can generate by improving guest satisfaction 
            and streamlining your check-in process with PromptlyCheckin.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              Your Hotel Metrics
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Guests
                </label>
                <input
                  type="number"
                  value={formData.currentGuests}
                  onChange={(e) => handleInputChange('currentGuests', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Average Length of Stay (nights)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.averageStay}
                  onChange={(e) => handleInputChange('averageStay', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Average Room Rate ($)
                </label>
                <input
                  type="number"
                  value={formData.roomRate}
                  onChange={(e) => handleInputChange('roomRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Check-in Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.checkinTime}
                  onChange={(e) => handleInputChange('checkinTime', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Guest Satisfaction (1-10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={formData.currentSatisfaction}
                  onChange={(e) => handleInputChange('currentSatisfaction', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="7.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Satisfaction with PromptlyCheckin (1-10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={formData.targetSatisfaction}
                  onChange={(e) => handleInputChange('targetSatisfaction', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="9.0"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
              Your ROI Results
            </h3>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Current Monthly Revenue</span>
                  <DollarSign className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${results.currentRevenue.toLocaleString()}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">Improved Monthly Revenue</span>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  ${results.improvedRevenue.toLocaleString()}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-600">Additional Monthly Revenue</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-900">
                  ${results.additionalRevenue.toLocaleString()}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-600">Annual ROI</span>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-purple-900">
                  {results.roi.toFixed(0)}%
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-600">Payback Period</span>
                  <Clock className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {results.paybackPeriod.toFixed(1)} months
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-600 rounded-lg text-white">
              <h4 className="font-semibold mb-2">Key Benefits with PromptlyCheckin:</h4>
              <ul className="text-sm space-y-1">
                <li>• 3-minute average check-in time</li>
                <li>• Increased guest satisfaction scores</li>
                <li>• Higher repeat booking rates</li>
                <li>• Optimized room rates through better reviews</li>
                <li>• Reduced front desk workload</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Check-in Experience?
            </h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of hotels already using PromptlyCheckin to boost revenue and guest satisfaction.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;