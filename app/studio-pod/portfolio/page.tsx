"use client"
import React, { useEffect, useState } from 'react'

export default function PortfolioPage() {
  const [showBalance, setShowBalance] = useState(false);
  const [prices, setPrices] = useState({ btc: { price: '0', change: '0' }, eth: { price: '0', change: '0' } });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT"]');
        const data = await res.json();
        setPrices({
          btc: { price: parseFloat(data[0].lastPrice).toLocaleString(), change: data[0].priceChangePercent },
          eth: { price: parseFloat(data[1].lastPrice).toLocaleString(), change: data[1].priceChangePercent }
        });
      } catch (e) { console.error("API Error"); }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* 1. LANDING (จุดพลุ) */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center rounded-[3.5rem] bg-gradient-to-br from-emerald-950/20 via-black to-black border border-white/5 overflow-hidden">
        <div className="z-10 text-center space-y-4">
          <h2 className="text-7xl font-black italic uppercase text-white tracking-tighter">Aurelius <span className="text-emerald-500">Sentinel</span></h2>
          <p className="text-gray-500 tracking-[1em] text-[10px] uppercase font-bold ml-4">The Ultimate EA Protocol</p>
        </div>
      </section>

      {/* 2. MARKET DATA */}
      <section className="grid md:grid-cols-2 gap-6 font-mono">
        <div className="bg-[#0A0A0A] border-l-4 border-orange-500 p-10 rounded-r-3xl">
          <p className="text-[10px] text-gray-500 mb-2">BTC / USDT</p>
          <div className="flex justify-between items-end"><p className="text-5xl font-bold">${prices.btc.price}</p><span className="text-emerald-500 text-sm">{prices.btc.change}%</span></div>
        </div>
        <div className="bg-[#0A0A0A] border-l-4 border-blue-500 p-10 rounded-r-3xl">
          <p className="text-[10px] text-gray-500 mb-2">ETH / USDT</p>
          <div className="flex justify-between items-end"><p className="text-5xl font-bold">${prices.eth.price}</p><span className="text-emerald-500 text-sm">{prices.eth.change}%</span></div>
        </div>
      </section>

      {/* 3. VAULT 50K */}
      <section className="bg-[#0A0A0A] border border-white/5 p-14 rounded-[4rem]">
        <div className="flex justify-between items-start mb-8 text-[10px] font-black uppercase tracking-widest text-emerald-500">
          <span>Sentinel Vault Status</span>
          <button onClick={() => setShowBalance(!showBalance)} className="bg-white/5 px-6 py-2 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all">
            {showBalance ? "✕ Hide" : "👁 Show"}
          </button>
        </div>
        <h3 className="text-9xl font-mono font-bold tracking-tighter">฿{showBalance ? "50,000" : "••••••"}</h3>
      </section>

      {/* 4. GUMROAD (GREEN) */}
      <section className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-12 rounded-[3.5rem] flex justify-between items-center">
        <h4 className="text-4xl font-black italic uppercase text-white">Gumroad <span className="text-emerald-500">Store</span></h4>
        <a href="https://gumroad.com/l/YOUR_ID" target="_blank" className="px-12 py-6 bg-emerald-500 text-black font-black rounded-2xl uppercase tracking-widest hover:scale-105 transition-all">Order Now</a>
      </section>

      {/* 5. BITKUB (แถบเขียวเชิญชวน) */}
      <section className="bg-gradient-to-r from-emerald-500/20 to-black border border-emerald-500/30 p-12 rounded-[3.5rem] flex justify-between items-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 shadow-[0_0_20px_#10b981]"></div>
        <div>
          <h4 className="text-3xl font-black italic uppercase text-white mb-2">ร่วมเป็นสมาชิกเครือข่าย <span className="text-emerald-500">BITKUB</span></h4>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">สมัครสมาชิกเพื่อรับสิทธิพิเศษในระบบ AureliusX</p>
        </div>
        <a href="YOUR_BITKUB_LINK" target="_blank" className="px-12 py-6 bg-emerald-500 text-black font-black rounded-2xl uppercase tracking-widest hover:bg-white transition-all">สมัครสมาชิกตอนนี้</a>
      </section>
    </div>
  )
}