import React, { useState } from 'react';
import { DollarSign, Users, Calendar, Eye, EyeOff, Info, Share2, Calculator } from 'lucide-react';

interface FormData {
  // Automated Waitlist Section
  patientsCanceled: string;
  canceledSpotsFilled: string;
  avgRevenueWaitlist: string;
  
  // Reactivated Patients Section
  totalPatientsSeen: string;
  patientsWithFutureAppt: string;
  patientsWithRecall: string;
  avgRevenueReactivated: string;
  totalPatientsBooked: string;
  totalPatientsNoShow: string;
  avgTimePerCall: string;
  staffSalaryPerHour: string;
  
  // Outstanding Balances Section
  patientsWithOpenBalances: string;
  avgOpenBalance: string;
  avgPaperStatements: string;
  costPerStatement: string;
  avgTimeToCollect: string;
  callsMadeToCollect: string;
  
  // Credit Card Processing Section
  currentFees: string;
  promptlyFeesInterchangePlus: string;
  promptlyFeesSurcharge: string;
  
  // Time Period
  timePeriodMonths: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    patientsCanceled: '',
    canceledSpotsFilled: '',
    avgRevenueWaitlist: '',
    totalPatientsSeen: '',
    patientsWithFutureAppt: '',
    patientsWithRecall: '',
    avgRevenueReactivated: '',
    totalPatientsBooked: '',
    totalPatientsNoShow: '',
    avgTimePerCall: '',
    staffSalaryPerHour: '',
    patientsWithOpenBalances: '',
    avgOpenBalance: '',
    avgPaperStatements: '',
    costPerStatement: '',
    avgTimeToCollect: '',
    callsMadeToCollect: '',
    currentFees: '',
    promptlyFeesInterchangePlus: '',
    promptlyFeesSurcharge: '',
    timePeriodMonths: '3'
  });

  const [selectedPromptlyFeeModel, setSelectedPromptlyFeeModel] = useState<'interchangePlus' | 'surcharge'>('interchangePlus');

  const [results, setResults] = useState<{
    waitlistROI: number | null;
    reactivatedROI: number | null;
    outstandingBalancesROI: number | null;
    ccProcessingSavings: number | null;
  }>({
    waitlistROI: null,
    reactivatedROI: null,
    outstandingBalancesROI: null,
    ccProcessingSavings: null
  });

  const [isLoading, setIsLoading] = useState(false);

  const [showMath, setShowMath] = useState<{
    waitlist: boolean;
    reactivated: boolean;
    outstanding: boolean;
    ccProcessing: boolean;
  }>({
    waitlist: false,
    reactivated: false,
    outstanding: false,
    ccProcessing: false
  });

  const [showTooltip, setShowTooltip] = useState<{
    waitlist: boolean;
    reactivated: boolean;
    outstanding: boolean;
    ccProcessing: boolean;
  }>({
    waitlist: false,
    reactivated: false,
    outstanding: false,
    ccProcessing: false
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    // For currency fields, allow only numbers and decimal points
    if (field.includes('Revenue') || field.includes('avgRevenue') || field.includes('Salary') || 
        field.includes('Balance') || field.includes('cost') || field.includes('Fees') || 
        field.includes('promptlyFees')) {
      const cleanValue = value.replace(/[^\d.]/g, '');
      setFormData(prev => {
        const newData = { ...prev, [field]: cleanValue };
        
        // Sync revenue fields between cards
        if (field === 'avgRevenueWaitlist') {
          newData.avgRevenueReactivated = cleanValue;
        } else if (field === 'avgRevenueReactivated') {
          newData.avgRevenueWaitlist = cleanValue;
        }
        
        return newData;
      });
    } else if (field === 'timePeriodMonths') {
      // For time period, allow only positive integers
      const cleanValue = value.replace(/[^\d]/g, '');
      if (cleanValue === '' || parseInt(cleanValue) > 0) {
        setFormData(prev => ({ ...prev, [field]: cleanValue }));
      }
    } else {
      // For number fields, allow only integers
      const cleanValue = value.replace(/[^\d]/g, '');
      setFormData(prev => ({ ...prev, [field]: cleanValue }));
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    return isNaN(numValue) ? '' : numValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  const calculateROI = () => {
    setIsLoading(true);
    
    // Get time period and ensure it's valid (default to 1 to prevent division by zero)
    const timePeriod = parseFloat(formData.timePeriodMonths) || 1;
    
    // Parse all inputs
    const input1 = parseFloat(formData.patientsCanceled) || 0;
    const input2 = parseFloat(formData.canceledSpotsFilled) || 0;
    const input3 = parseFloat(formData.avgRevenueWaitlist) || 0;
    const input4 = parseFloat(formData.totalPatientsSeen) || 0;
    const input5 = parseFloat(formData.patientsWithFutureAppt) || 0;
    const input6 = parseFloat(formData.patientsWithRecall) || 0;
    const input7 = parseFloat(formData.avgRevenueReactivated) || 0;
    const avgTimePerCall = parseFloat(formData.avgTimePerCall) || 0;
    const staffSalaryPerHour = parseFloat(formData.staffSalaryPerHour) || 0;

    // Outstanding Balances inputs
    const patientsWithOpenBalances = parseFloat(formData.patientsWithOpenBalances) || 0;
    const avgOpenBalance = parseFloat(formData.avgOpenBalance) || 0;
    const avgPaperStatements = parseFloat(formData.avgPaperStatements) || 0;
    const costPerStatement = parseFloat(formData.costPerStatement) || 0;
    const avgTimeToCollect = parseFloat(formData.avgTimeToCollect) || 0;
    const callsMadeToCollect = parseFloat(formData.callsMadeToCollect) || 0;

    // Credit Card Processing inputs
    const currentFees = parseFloat(formData.currentFees) || 0;
    const promptlyFees = selectedPromptlyFeeModel === 'interchangePlus' 
      ? parseFloat(formData.promptlyFeesInterchangePlus) || 0
      : parseFloat(formData.promptlyFeesSurcharge) || 0;

    // Formula 1: Automated Waitlist ROI
    const successfulWaitlistAppointments = (input1 - input2) * 0.25;
    const revenueFromWaitlist = successfulWaitlistAppointments * input3;
    
    // Calculate calling cost savings for waitlist (assuming 4 calls needed per successful appointment at 25% success rate)
    const totalWaitlistCallsNeeded = successfulWaitlistAppointments * 4;
    const totalWaitlistMinutesSpent = totalWaitlistCallsNeeded * avgTimePerCall;
    const waitlistCallingCostSavings = (totalWaitlistMinutesSpent / 60) * staffSalaryPerHour;
    
    const waitlistROI = (revenueFromWaitlist + waitlistCallingCostSavings) / timePeriod;

    // Formula 2: Reactivated Patients ROI (with calling cost savings)
    const successfulReactivations = (input4 - input5 - input6) * 0.25;
    const reactivatedRevenue = successfulReactivations * input7;
    
    // No-show improvement calculation
    const totalBooked = parseFloat(formData.totalPatientsBooked) || 0;
    const totalNoShows = parseFloat(formData.totalPatientsNoShow) || 0;
    const currentNoShowRate = totalBooked > 0 ? totalNoShows / totalBooked : 0;
    const improvedNoShows = totalNoShows * 0.75; // 25% improvement
    const additionalAppointments = totalNoShows - improvedNoShows;
    const noShowImprovementRevenue = additionalAppointments * input7;
    
    const reactivatedROI = (reactivatedRevenue + noShowImprovementRevenue) / timePeriod;

    // Formula 3: Outstanding Balances ROI
    const patientsPayingViaText = patientsWithOpenBalances * 0.15; // 15% success rate
    const revenueFromAutomatedPayments = patientsPayingViaText * avgOpenBalance;
    
    // Paper statement savings (15% reduction)
    const statementReduction = avgPaperStatements * 0.15;
    const statementSavings = statementReduction * costPerStatement;
    
    // Labor savings (15% reduction in call time)
    const laborReduction = callsMadeToCollect * avgTimeToCollect * 0.15;
    const laborSavings = (laborReduction / 60) * staffSalaryPerHour;
    
    const outstandingBalancesROI = (revenueFromAutomatedPayments + statementSavings + laborSavings) / timePeriod;

    // Formula 4: Credit Card Processing Savings
    // Note: CC processing fees are already monthly, so no division needed
    const ccProcessingSavings = currentFees - promptlyFees;

    // Simulate calculation time for better UX
    setTimeout(() => {
      setResults({
        waitlistROI,
        reactivatedROI,
        outstandingBalancesROI,
        ccProcessingSavings
      });

      // Reset show math state when new calculations are made
      setShowMath({
        waitlist: false,
        reactivated: false,
        outstanding: false,
        ccProcessing: false
      });
      
      setIsLoading(false);
    }, 1500);
  };

  const toggleMath = (type: 'waitlist' | 'reactivated' | 'outstanding' | 'ccProcessing') => {
    setShowMath(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const shareResults = async () => {
    const waitlistResult = results.waitlistROI?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }) || '$0.00';
    
    const reactivatedResult = results.reactivatedROI?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }) || '$0.00';

    const outstandingResult = results.outstandingBalancesROI?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }) || '$0.00';

    const ccSavingsResult = results.ccProcessingSavings?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }) || '$0.00';

    const shareText = `ROI Calculator Results:

🗓️ Automated Waitlist ROI: ${waitlistResult}
👥 Reactivated Patients ROI: ${reactivatedResult}
💰 Outstanding Balances ROI: ${outstandingResult}
💳 Credit Card Processing Savings: ${ccSavingsResult}

Total Potential ROI: ${((results.waitlistROI || 0) + (results.reactivatedROI || 0) + (results.outstandingBalancesROI || 0) + (results.ccProcessingSavings || 0)).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })}

Calculate your own ROI at: ${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ROI Calculator Results',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Sharing cancelled or failed');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Results copied to clipboard! You can now paste and share them.');
      } catch (error) {
        // Fallback to manual copy
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Results copied to clipboard! You can now paste and share them.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f2]">
      <div className="container mx-auto px-4 py-8 bg-[#f6f6f2]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src="/DataPlunge Logo.svg" alt="DataPlunge Logo" className="h-8 w-8 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                ROI Calculator
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Calculate your return on investment for automated waitlists and patient reactivation
            </p>
            <div className="mt-4 p-4 bg-[#fdd94d] border border-amber-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-[#1a1a19] text-sm font-medium">
                <span className="inline-block animate-pulse drop-shadow-lg filter brightness-110" style={{textShadow: '1px 1px 0 #1a1a19, -1px -1px 0 #1a1a19, 1px -1px 0 #1a1a19, -1px 1px 0 #1a1a19'}}>💡</span> For best results, use a minimum of 3 months of data and the same data period for each calculation
              </p>
            </div>
            
            {/* Time Period Input */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                <label className="block text-base font-semibold text-gray-900 mb-2 text-center">
                  What time period does your data represent?
                </label>
                <div className="flex items-center justify-center space-x-2">
                  <input
                    type="text"
                    value={formData.timePeriodMonths}
                    onChange={(e) => handleInputChange('timePeriodMonths', e.target.value)}
                    className="w-[60px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-base font-semibold"
                    placeholder="3"
                  />
                  <span className="text-base font-medium text-gray-700">
                    {parseInt(formData.timePeriodMonths) === 1 ? 'month' : 'months'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-1.5">
                  Enter the number of months your data covers
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 bg-white">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Section 1: Automated Waitlist */}
                <div className="space-y-6">
                  <div className="flex items-center mb-6 relative">
                    <Calendar className="h-6 w-6 mr-2 animate-pulse" style={{animationDuration: '2s', color: '#00dd84'}} />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Automated Waitlist
                    </h2>
                    <div className="relative ml-2">
                      <button
                        onMouseEnter={() => setShowTooltip(prev => ({ ...prev, waitlist: true }))}
                        onMouseLeave={() => setShowTooltip(prev => ({ ...prev, waitlist: false }))}
                        className="transition-colors"
                        style={{ color: '#00dd84' }}
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      {showTooltip.waitlist && (
                        <div className="absolute left-0 top-6 z-10 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                          <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          This calculates the additional revenue generated by automatically filling canceled appointment slots through your waitlist system. It assumes a 25% success rate for converting waitlisted patients into booked appointments.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patients Canceled 24+ Hours Before Appointment Date
                      </label>
                      <input
                        type="text"
                        value={formData.patientsCanceled}
                        onChange={(e) => handleInputChange('patientsCanceled', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter number of patients"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Canceled Spots That Were Filled By Staff
                      </label>
                      <input
                        type="text"
                        value={formData.canceledSpotsFilled}
                        onChange={(e) => handleInputChange('canceledSpotsFilled', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter number of spots filled"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avg. Revenue Collected Per Appointment
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.avgRevenueWaitlist}
                          onChange={(e) => handleInputChange('avgRevenueWaitlist', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avg. Time Per Call (minutes)
                      </label>
                      <input
                        type="text"
                        value={formData.avgTimePerCall}
                        onChange={(e) => handleInputChange('avgTimePerCall', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter minutes"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Staff Salary Per Hour
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.staffSalaryPerHour}
                          onChange={(e) => handleInputChange('staffSalaryPerHour', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Reactivated Patients */}
                <div className="space-y-6">
                  <div className="flex items-center mb-6 relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 mr-2 users-draw-animation"
                      style={{ color: '#f390f4' }}
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeDasharray="30" strokeDashoffset="30" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 22 8v2" strokeDasharray="25" strokeDashoffset="25" />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Reactivated Patients
                    </h2>
                    <div className="relative ml-2">
                      <button
                        onMouseEnter={() => setShowTooltip(prev => ({ ...prev, reactivated: true }))}
                        onMouseLeave={() => setShowTooltip(prev => ({ ...prev, reactivated: false }))}
                        className="transition-colors"
                        style={{ color: '#f390f4' }}
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      {showTooltip.reactivated && (
                        <div className="absolute left-0 top-6 z-10 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                          <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          This calculates revenue from reactivating patients who haven't scheduled future appointments or recalls. It assumes a 25% success rate for reactivation campaigns and includes no-show improvement benefits.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How many patients did you schedule for this time period (for no-show calculation)?
                      </label>
                      <input
                        type="text"
                        value={formData.totalPatientsBooked}
                        onChange={(e) => handleInputChange('totalPatientsBooked', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter total booked"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How many patients have you seen during this time period?
                      </label>
                      <input
                        type="text"
                        value={formData.totalPatientsSeen}
                        onChange={(e) => handleInputChange('totalPatientsSeen', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter total patients"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Of the patients seen, how many scheduled a future appointment?
                      </label>
                      <input
                        type="text"
                        value={formData.patientsWithFutureAppt}
                        onChange={(e) => handleInputChange('patientsWithFutureAppt', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter number of patients"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How many of those seen patients have a recall date set, without a future appointment booked?
                      </label>
                      <input
                        type="text"
                        value={formData.patientsWithRecall}
                        onChange={(e) => handleInputChange('patientsWithRecall', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter number of patients"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What is the average revenue you collect per appointment?
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.avgRevenueReactivated}
                          onChange={(e) => handleInputChange('avgRevenueReactivated', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How many patients did not cancel and did not show up for their scheduled appointment?
                      </label>
                      <input
                        type="text"
                        value={formData.totalPatientsNoShow}
                        onChange={(e) => handleInputChange('totalPatientsNoShow', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        placeholder="Enter no-shows"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Outstanding Balances and Credit Card Processing sections */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Section 3: Outstanding Balances */}
                <div className="space-y-6">
                  <div className="flex items-center mb-6 relative">
                    <DollarSign className="h-6 w-6 mr-2 animate-spin" style={{animationDuration: '5s', color: '#2069f7'}} />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Outstanding Balances
                    </h2>
                    <div className="relative ml-2">
                      <button
                        onMouseEnter={() => setShowTooltip(prev => ({ ...prev, outstanding: true }))}
                        onMouseLeave={() => setShowTooltip(prev => ({ ...prev, outstanding: false }))}
                        className="transition-colors"
                        style={{ color: '#2069f7' }}
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      {showTooltip.outstanding && (
                        <div className="absolute left-0 top-6 z-10 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                          <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          This calculates savings from automated payment collection, reduced paper statements, and decreased collection call time. Assumes 15% success rate for automated payments and 15% reduction in manual collection efforts.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patients With Open Balances
                      </label>
                      <input
                        type="text"
                        value={formData.patientsWithOpenBalances}
                        onChange={(e) => handleInputChange('patientsWithOpenBalances', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Enter number of patients"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avg. Open Balance Per Patient
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.avgOpenBalance}
                          onChange={(e) => handleInputChange('avgOpenBalance', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avg. Paper Statements Sent Per Month
                      </label>
                      <input
                        type="text"
                        value={formData.avgPaperStatements}
                        onChange={(e) => handleInputChange('avgPaperStatements', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Enter number of statements"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cost Per Statement
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.costPerStatement}
                          onChange={(e) => handleInputChange('costPerStatement', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avg. Time to Collect Per Call (minutes)
                      </label>
                      <input
                        type="text"
                        value={formData.avgTimeToCollect}
                        onChange={(e) => handleInputChange('avgTimeToCollect', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Enter minutes"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Calls Made to Collect Per Month
                      </label>
                      <input
                        type="text"
                        value={formData.callsMadeToCollect}
                        onChange={(e) => handleInputChange('callsMadeToCollect', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Enter number of calls"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Credit Card Processing */}
                <div className="space-y-6">
                  <div className="flex items-center mb-6 relative">
                    <DollarSign className="h-6 w-6 mr-2 animate-spin" style={{animationDuration: '5s', color: '#a3eaff'}} />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Credit Card Processing
                    </h2>
                    <div className="relative ml-2">
                      <button
                        onMouseEnter={() => setShowTooltip(prev => ({ ...prev, ccProcessing: true }))}
                        onMouseLeave={() => setShowTooltip(prev => ({ ...prev, ccProcessing: false }))}
                        className="transition-colors"
                        style={{ color: '#a3eaff' }}
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      {showTooltip.ccProcessing && (
                        <div className="absolute left-0 top-6 z-10 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                          <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          This calculates the monthly savings from switching to Promptly's credit card processing rates compared to your current processor.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> If you would like to analyze your current processing costs, please send 2-3 credit card statements to your Promptly Representative. The analysis will include any potential savings when moving from a "flat fee" model to "Interchange+" as well as the savings when switching to "Surcharge/Technology Fee".
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Monthly Processing Fees
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.currentFees}
                          onChange={(e) => handleInputChange('currentFees', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Promptly Fee Model
                      </label>
                      <div className="mb-4">
                        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setSelectedPromptlyFeeModel('interchangePlus')}
                            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                              selectedPromptlyFeeModel === 'interchangePlus'
                                ? 'bg-orange-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            Interchange+
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedPromptlyFeeModel('surcharge')}
                            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                              selectedPromptlyFeeModel === 'surcharge'
                                ? 'bg-orange-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            Surcharge/Technology Fee
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {selectedPromptlyFeeModel === 'interchangePlus' 
                          ? 'Promptly Processing Fees (Interchange+)' 
                          : 'Promptly Processing Fees (Surcharge/Technology Fee)'}
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={selectedPromptlyFeeModel === 'interchangePlus' 
                            ? formData.promptlyFeesInterchangePlus 
                            : formData.promptlyFeesSurcharge}
                          onChange={(e) => handleInputChange(
                            selectedPromptlyFeeModel === 'interchangePlus' 
                              ? 'promptlyFeesInterchangePlus' 
                              : 'promptlyFeesSurcharge', 
                            e.target.value
                          )}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <div className="text-center mb-8">
                <button
                  onClick={calculateROI}
                  disabled={isLoading}
                  className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg transform ${
                    isLoading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-1 hover:scale-105'
                  }`}
                >
                  <Calculator className={`inline-block mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Calculating...' : 'Calculate ROI'}
                </button>
              </div>

              {/* Results Section */}
              {(results.waitlistROI !== null || results.reactivatedROI !== null || results.outstandingBalancesROI !== null || results.ccProcessingSavings !== null) && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your ROI Results</h3>
                    <button
                      onClick={shareResults}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Results
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Waitlist ROI Result */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                          <h4 className="text-lg font-semibold text-gray-900">Automated Waitlist ROI</h4>
                        </div>
                        <button
                          onClick={() => toggleMath('waitlist')}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {showMath.waitlist ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {results.waitlistROI?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2
                        })}
                      </div>
                      <p className="text-sm text-gray-600">Monthly additional revenue</p>
                      
                      {showMath.waitlist && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                          <h5 className="font-semibold text-gray-900 mb-2">Calculation Breakdown:</h5>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div>Unfilled cancellations: {parseFloat(formData.patientsCanceled) - parseFloat(formData.canceledSpotsFilled)}</div>
                            <div>Successful waitlist appointments (25%): {((parseFloat(formData.patientsCanceled) - parseFloat(formData.canceledSpotsFilled)) * 0.25).toFixed(1)}</div>
                            <div>Revenue from appointments: {formatCurrency(String(((parseFloat(formData.patientsCanceled) - parseFloat(formData.canceledSpotsFilled)) * 0.25 * parseFloat(formData.avgRevenueWaitlist))))}</div>
                            <div>Calling cost savings: {formatCurrency(String((((parseFloat(formData.patientsCanceled) - parseFloat(formData.canceledSpotsFilled)) * 0.25 * 4 * parseFloat(formData.avgTimePerCall)) / 60) * parseFloat(formData.staffSalaryPerHour)))}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reactivated Patients ROI Result */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Users className="h-6 w-6 text-green-600 mr-2" />
                          <h4 className="text-lg font-semibold text-gray-900">Reactivated Patients ROI</h4>
                        </div>
                        <button
                          onClick={() => toggleMath('reactivated')}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          {showMath.reactivated ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {results.reactivatedROI?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2
                        })}
                      </div>
                      <p className="text-sm text-gray-600">Monthly additional revenue</p>
                      
                      {showMath.reactivated && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                          <h5 className="font-semibold text-gray-900 mb-2">Calculation Breakdown:</h5>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div>Patients without future appointments: {parseFloat(formData.totalPatientsSeen) - parseFloat(formData.patientsWithFutureAppt) - parseFloat(formData.patientsWithRecall)}</div>
                            <div>Successful reactivations (25%): {((parseFloat(formData.totalPatientsSeen) - parseFloat(formData.patientsWithFutureAppt) - parseFloat(formData.patientsWithRecall)) * 0.25).toFixed(1)}</div>
                            <div>Revenue from reactivations: {formatCurrency(String(((parseFloat(formData.totalPatientsSeen) - parseFloat(formData.patientsWithFutureAppt) - parseFloat(formData.patientsWithRecall)) * 0.25 * parseFloat(formData.avgRevenueReactivated))))}</div>
                            <div>No-show improvement revenue: {formatCurrency(String((parseFloat(formData.totalPatientsNoShow) * 0.25 * parseFloat(formData.avgRevenueReactivated))))}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Outstanding Balances ROI Result */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-6 w-6 text-purple-600 mr-2" />
                          <h4 className="text-lg font-semibold text-gray-900">Outstanding Balances ROI</h4>
                        </div>
                        <button
                          onClick={() => toggleMath('outstanding')}
                          className="text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          {showMath.outstanding ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {results.outstandingBalancesROI?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2
                        })}
                      </div>
                      <p className="text-sm text-gray-600">Monthly savings & revenue</p>
                      
                      {showMath.outstanding && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                          <h5 className="font-semibold text-gray-900 mb-2">Calculation Breakdown:</h5>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div>Patients paying via text (15%): {(parseFloat(formData.patientsWithOpenBalances) * 0.15).toFixed(1)}</div>
                            <div>Revenue from automated payments: {formatCurrency(String(parseFloat(formData.patientsWithOpenBalances) * 0.15 * parseFloat(formData.avgOpenBalance)))}</div>
                            <div>Statement savings (15% reduction): {formatCurrency(String(parseFloat(formData.avgPaperStatements) * 0.15 * parseFloat(formData.costPerStatement)))}</div>
                            <div>Labor savings (15% reduction): {formatCurrency(String((parseFloat(formData.callsMadeToCollect) * parseFloat(formData.avgTimeToCollect) * 0.15 / 60) * parseFloat(formData.staffSalaryPerHour)))}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Credit Card Processing Savings Result */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-6 w-6 text-orange-600 mr-2" />
                          <h4 className="text-lg font-semibold text-gray-900">Credit Card Processing Savings</h4>
                        </div>
                        <button
                          onClick={() => toggleMath('ccProcessing')}
                          className="text-orange-600 hover:text-orange-800 transition-colors"
                        >
                          {showMath.ccProcessing ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {results.ccProcessingSavings?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2
                        })}
                      </div>
                      <p className="text-sm text-gray-600">Monthly savings</p>
                      
                      {showMath.ccProcessing && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
                          <h5 className="font-semibold text-gray-900 mb-2">Calculation Breakdown:</h5>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div>Current monthly fees: {formatCurrency(formData.currentFees)}</div>
                            <div>Promptly fees ({selectedPromptlyFeeModel === 'interchangePlus' ? 'Interchange+' : 'Surcharge/Technology Fee'}): {formatCurrency(selectedPromptlyFeeModel === 'interchangePlus' ? formData.promptlyFeesInterchangePlus : formData.promptlyFeesSurcharge)}</div>
                            <div>Monthly savings: {formatCurrency(String(parseFloat(formData.currentFees) - (selectedPromptlyFeeModel === 'interchangePlus' ? parseFloat(formData.promptlyFeesInterchangePlus) : parseFloat(formData.promptlyFeesSurcharge))))}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total ROI Summary */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl text-center">
                    <h3 className="text-2xl font-bold mb-4">Total Monthly ROI</h3>
                    <div className="text-5xl font-bold mb-2">
                      {((results.waitlistROI || 0) + (results.reactivatedROI || 0) + (results.outstandingBalancesROI || 0) + (results.ccProcessingSavings || 0)).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2
                      })}
                    </div>
                    <p className="text-xl opacity-90">
                      Annual ROI: {(((results.waitlistROI || 0) + (results.reactivatedROI || 0) + (results.outstandingBalancesROI || 0) + (results.ccProcessingSavings || 0)) * 12).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </div>
              )}
T            </div>
          </div>
        </div>
  );
}

export default App;