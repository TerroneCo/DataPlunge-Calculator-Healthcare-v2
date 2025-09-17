import React, { useState } from 'react';
import { Calculator, TrendingUp, Users, DollarSign, Clock, CheckCircle } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    currentGuests: '',
    avgStayLength: '',
    avgRoomRate: '',
    currentCheckInTime: '',
    targetCheckInTime: '',
    staffHourlyRate: ''
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateROI = () => {
    const {
      currentGuests,
      avgStayLength,
      avgRoomRate,
      currentCheckInTime,
      targetCheckInTime,
      staffHourlyRate
    } = formData;

    // Convert inputs to numbers
    const guests = parseFloat(currentGuests) || 0;
    const stayLength = parseFloat(avgStayLength) || 0;
    const roomRate = parseFloat(avgRoomRate) || 0;
    const currentTime = parseFloat(currentCheckInTime) || 0;
    const targetTime = parseFloat(targetCheckInTime) || 0;
    const hourlyRate = parseFloat(staffHourlyRate) || 0;

    // Calculate time savings per guest
    const timeSavingsPerGuest = Math.max(0, currentTime - targetTime);
    
    // Calculate annual metrics
    const annualGuests = guests * 365;
    const totalTimeSavingsHours = (annualGuests * timeSavingsPerGuest) / 60;
    const laborCostSavings = totalTimeSavingsHours * hourlyRate;
    
    // Calculate revenue impact (assuming 5% increase in guest satisfaction leads to 2% revenue increase)
    const annualRevenue = guests * stayLength * roomRate * 365;
    const revenueIncrease = annualRevenue * 0.02;
    
    // Total annual savings
    const totalAnnualSavings = laborCostSavings + revenueIncrease;
    
    // Assuming PromptlyCheckin costs $2000/year (example)
    const annualCost = 2000;
    const roi = ((totalAnnualSavings - annualCost) / annualCost) * 100;

    setResults({
      timeSavingsPerGuest,
      totalTimeSavingsHours: Math.round(totalTimeSavingsHours),
      laborCostSavings: Math.round(laborCostSavings),
      revenueIncrease: Math.round(revenueIncrease),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      roi: Math.round(roi),
      paybackPeriod: Math.round((annualCost / totalAnnualSavings) * 12)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/DataPlunge Logo.svg" 
                alt="DataPlunge Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PromptlyCheckin</h1>
                <p className="text-sm text-gray-600">ROI Calculator</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-indigo-600">
              <Calculator className="h-6 w-6" />
              <span className="font-semibold">Calculate Your Savings</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Hotel Information</h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Daily Guests
                  </label>
                  <input
                    type="number"
                    name="currentGuests"
                    value={formData.currentGuests}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Avg Stay Length (nights)
                  </label>
                  <input
                    type="number"
                    name="avgStayLength"
                    value={formData.avgStayLength}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 2.5"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Average Room Rate ($)
                </label>
                <input
                  type="number"
                  name="avgRoomRate"
                  value={formData.avgRoomRate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 150"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Check-in Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="currentCheckInTime"
                    value={formData.currentCheckInTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Check-in Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="targetCheckInTime"
                    value={formData.targetCheckInTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Hourly Rate ($)
                </label>
                <input
                  type="number"
                  name="staffHourlyRate"
                  value={formData.staffHourlyRate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 25"
                />
              </div>

              <button
                onClick={calculateROI}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Calculator className="h-5 w-5" />
                <span>Calculate ROI</span>
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">ROI Analysis</h2>
            </div>

            {results ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.timeSavingsPerGuest} min
                    </div>
                    <div className="text-sm text-gray-600">Time Saved Per Guest</div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {results.totalTimeSavingsHours} hrs
                    </div>
                    <div className="text-sm text-gray-600">Annual Time Savings</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Labor Cost Savings</span>
                    <span className="font-semibold text-green-600">
                      ${results.laborCostSavings.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Revenue Increase</span>
                    <span className="font-semibold text-green-600">
                      ${results.revenueIncrease.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-300">
                    <span className="font-semibold text-gray-900">Total Annual Savings</span>
                    <span className="font-bold text-green-600 text-lg">
                      ${results.totalAnnualSavings.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{results.roi}%</div>
                    <div className="text-indigo-100 mb-4">Return on Investment</div>
                    <div className="text-sm">
                      Payback Period: {results.paybackPeriod} months
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">Key Benefits</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Faster check-in process improves guest satisfaction</li>
                    <li>• Reduced staff workload allows focus on other tasks</li>
                    <li>• Improved operational efficiency</li>
                    <li>• Enhanced guest experience leads to better reviews</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">
                  Enter your hotel information to see the ROI analysis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About PromptlyCheckin</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Faster Check-ins</h4>
              <p className="text-sm text-gray-600">
                Streamline the check-in process with automated workflows
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Better Guest Experience</h4>
              <p className="text-sm text-gray-600">
                Reduce wait times and improve overall satisfaction
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Increased Revenue</h4>
              <p className="text-sm text-gray-600">
                Happy guests lead to better reviews and repeat bookings
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;