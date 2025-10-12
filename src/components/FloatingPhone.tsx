import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface ChartData {
  time: string;
  value: number;
  change: number;
}

const FloatingPhone = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.2345);
  const [priceChange, setPriceChange] = useState(0.0012);

  // Generate initial chart data
  useEffect(() => {
    const generateChartData = () => {
      const data: ChartData[] = [];
      let baseValue = 1.2345;
      
      for (let i = 0; i < 20; i++) {
        const change = (Math.random() - 0.5) * 0.01;
        baseValue += change;
        data.push({
          time: `${9 + Math.floor(i / 4)}:${(i % 4) * 15}`.padStart(2, '0'),
          value: baseValue,
          change: change
        });
      }
      return data;
    };

    setChartData(generateChartData());
    setIsVisible(true);
  }, []);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.002;
      setCurrentPrice(prev => {
        const newPrice = prev + change;
        setPriceChange(change);
        return newPrice;
      });

      // Update chart data
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1]?.value || 1.2345;
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          value: lastValue + change,
          change: change
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getMaxValue = () => Math.max(...chartData.map(d => d.value));
  const getMinValue = () => Math.min(...chartData.map(d => d.value));
  const maxValue = getMaxValue();
  const minValue = getMinValue();
  const range = maxValue - minValue || 0.01;

  return (
    <>
      {/* Desktop Floating Phone */}
      <div className={`fixed right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-30 transition-all duration-1000 hidden lg:block ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}>
        {/* Desktop Phone Content */}
        {renderPhone()}
      </div>

      {/* Mobile Floating Phone - Smaller and Better Positioned */}
      <div className={`fixed right-2 bottom-4 z-20 transition-all duration-1000 lg:hidden ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}>
        {/* Mobile Phone Content */}
        {renderMobilePhone()}
      </div>
    </>
  );

  function renderPhone() {
    return (
      <>
        {/* Floating Phone Container */}
        <div className="relative animate-bounce" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}>
          {/* Phone Frame */}
          <div className="w-64 h-[500px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-800 hover:shadow-3xl transition-shadow duration-300">
            {/* Phone Screen */}
            <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative">
              {/* Status Bar */}
              <div className="h-6 bg-gray-900 flex items-center justify-between px-4 text-white text-xs">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 border border-white rounded-sm">
                    <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                  </div>
                </div>
              </div>

              {/* App Header */}
              <div className="bg-primary h-12 flex items-center justify-between px-4 text-white">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold">Valora Capital</span>
                </div>
                <div className="flex items-center gap-1">
                  {priceChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-mono ${
                    priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Chart Container */}
              <div className="p-4 bg-gray-50 h-full">
                {/* Current Price Display */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900 font-mono">
                    ${currentPrice.toFixed(4)}
                  </div>
                  <div className="text-sm text-gray-600">EUR/USD</div>
                </div>

                {/* Mini Chart */}
                <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
                  <div className="text-xs text-gray-600 mb-2">Live Chart</div>
                  <div className="h-24 relative">
                    <svg className="w-full h-full" viewBox="0 0 200 80">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="20" height="16" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 16" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="200" height="80" fill="url(#grid)" />
                      
                      {/* Chart line */}
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        points={chartData.map((d, i) => 
                          `${(i / (chartData.length - 1)) * 200},${80 - ((d.value - minValue) / range) * 80}`
                        ).join(' ')}
                      />
                      
                      {/* Animated dot at the end */}
                      {chartData.length > 0 && (
                        <circle
                          cx={(chartData.length - 1) / (chartData.length - 1) * 200}
                          cy={80 - ((chartData[chartData.length - 1].value - minValue) / range) * 80}
                          r="3"
                          fill="#3b82f6"
                          className="animate-pulse"
                        />
                      )}
                    </svg>
                  </div>
                </div>

                {/* Trading Pairs */}
                <div className="space-y-2">
                  {[
                    { pair: 'GBP/USD', price: 1.2847, change: 0.0023 },
                    { pair: 'USD/JPY', price: 149.23, change: -0.45 },
                    { pair: 'AUD/USD', price: 0.6754, change: 0.0012 },
                    { pair: 'USD/CAD', price: 1.3456, change: -0.0034 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{item.pair}</div>
                        <div className="text-xs text-gray-600">{item.price.toFixed(4)}</div>
                      </div>
                      <div className={`text-sm font-mono ${
                        item.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(4)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trading Button */}
                <div className="mt-4">
                  <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Start Trading
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Animation */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-8 -left-8 animate-bounce">
          <div className="w-3 h-3 bg-primary rounded-full opacity-60"></div>
        </div>
        <div className="absolute -bottom-8 -right-8 animate-bounce" style={{ animationDelay: '1s' }}>
          <div className="w-2 h-2 bg-green-500 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-1/2 -left-12 animate-bounce" style={{ animationDelay: '2s' }}>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-60"></div>
        </div>
      </>
    );
  }

  function renderMobilePhone() {
    return (
      <div className="w-32 sm:w-40 h-64 sm:h-72 bg-gray-900 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-2xl border border-gray-800 hover:scale-105 transition-transform duration-300">
        {/* Mobile Phone Screen */}
        <div className="w-full h-full bg-black rounded-lg sm:rounded-xl overflow-hidden relative">
          {/* Status Bar */}
          <div className="h-4 bg-gray-900 flex items-center justify-between px-2 text-white text-[8px] sm:text-xs">
            <span>9:41</span>
            <div className="w-2 h-1 border border-white rounded-sm">
              <div className="w-1 h-0.5 bg-white rounded-sm"></div>
            </div>
          </div>

          {/* App Header */}
          <div className="bg-primary h-6 sm:h-7 flex items-center justify-between px-2 text-white">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <DollarSign className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="text-[9px] sm:text-xs font-semibold">Valora</span>
            </div>
            <div className="flex items-center gap-0.5">
              {priceChange >= 0 ? (
                <TrendingUp className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-400" />
              ) : (
                <TrendingDown className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-red-400" />
              )}
              <span className={`text-[8px] sm:text-[10px] font-mono ${
                priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Chart Container */}
          <div className="p-1.5 sm:p-2 bg-gray-50 h-full">
            {/* Current Price Display */}
            <div className="mb-1.5">
              <div className="text-sm sm:text-base font-bold text-gray-900 font-mono">
                ${currentPrice.toFixed(4)}
              </div>
              <div className="text-[8px] sm:text-xs text-gray-600">EUR/USD</div>
            </div>

            {/* Mini Chart */}
            <div className="bg-white rounded p-1 sm:p-1.5 shadow-sm mb-1.5">
              <div className="text-[8px] sm:text-[10px] text-gray-600 mb-0.5">Live</div>
              <div className="h-12 sm:h-14 relative">
                <svg className="w-full h-full" viewBox="0 0 200 60">
                  <defs>
                    <pattern id="grid-mobile" width="20" height="12" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 12" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="200" height="60" fill="url(#grid-mobile)" />
                  
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    points={chartData.map((d, i) => 
                      `${(i / (chartData.length - 1)) * 200},${60 - ((d.value - minValue) / range) * 60}`
                    ).join(' ')}
                  />
                  
                  {chartData.length > 0 && (
                    <circle
                      cx={(chartData.length - 1) / (chartData.length - 1) * 200}
                      cy={60 - ((chartData[chartData.length - 1].value - minValue) / range) * 60}
                      r="2"
                      fill="#3b82f6"
                      className="animate-pulse"
                    />
                  )}
                </svg>
              </div>
            </div>

            {/* Trading Pairs - Only one on very small screens */}
            <div className="space-y-0.5 sm:space-y-1">
              {[
                { pair: 'GBP/USD', price: 1.2847, change: 0.0023 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-1 bg-white rounded text-[8px] sm:text-xs">
                  <div>
                    <div className="font-semibold text-gray-900">{item.pair}</div>
                    <div className="text-gray-600">{item.price.toFixed(4)}</div>
                  </div>
                  <div className={`font-mono ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(3)}
                  </div>
                </div>
              ))}
            </div>

            {/* Trading Button */}
            <div className="mt-1.5">
              <button className="w-full bg-primary text-white py-1 sm:py-1.5 rounded text-[9px] sm:text-xs font-semibold hover:bg-primary/90 transition-colors">
                Trade
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default FloatingPhone;