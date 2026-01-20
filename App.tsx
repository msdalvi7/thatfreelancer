
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { User, UserRole, Order, OrderStatus } from './types';
import { SERVICES } from './constants';
import { Button, Card, Badge, SectionTitle } from './components/UI';
import { generateSmartBrief } from './services/geminiService';

// --- Shared Logo Component ---
const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-baseline font-black tracking-tighter ${className}`}>
    <span className="text-orange-500">tha</span>
    <div className="relative inline-flex items-center mx-[-1px]">
       <span className="text-orange-500">t</span>
       <span className="text-purple-600 ml-[-2px]">F</span>
       <div className="absolute -top-1 -right-3 text-purple-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
       </div>
    </div>
    <span className="text-purple-600">reelancer</span>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('tf_user');
    const savedOrders = localStorage.getItem('tf_orders');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const login = (role: UserRole) => {
    const newUser = { id: 'u1', name: 'John Doe', email: 'john@example.com', role };
    setUser(newUser);
    localStorage.setItem('tf_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tf_user');
  };

  const addOrder = (order: Order) => {
    const newOrders = [...orders, order];
    setOrders(newOrders);
    localStorage.setItem('tf_orders', JSON.stringify(newOrders));
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const newOrders = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(newOrders);
    localStorage.setItem('tf_orders', JSON.stringify(newOrders));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={logout} onLogin={login} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetail user={user} onOrder={addOrder} />} />
            <Route path="/dashboard" element={<Dashboard user={user} orders={orders} updateStatus={updateOrderStatus} />} />
            <Route path="/checkout" element={<Checkout onOrder={addOrder} />} />
          </Routes>
        </main>
        <Footer />
        <MobileNav user={user} />
      </div>
    </HashRouter>
  );
};

const Navbar: React.FC<{ user: User | null; onLogout: () => void; onLogin: (r: UserRole) => void }> = ({ user, onLogout, onLogin }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism h-16 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-8">
        <Link to="/"><Logo className="text-xl md:text-2xl" /></Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/services" className="text-slate-600 hover:text-purple-600 font-bold transition-colors">Services</Link>
          <a href="#" className="text-slate-600 hover:text-purple-600 font-bold transition-colors">How it Works</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-purple-600 font-bold">Dashboard</Link>
            <button onClick={onLogout} className="text-slate-400 hover:text-orange-500 transition-colors">
              <LogOutIcon />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" className="hidden sm:flex" onClick={() => onLogin(UserRole.ADMIN)}>Admin</Button>
            <Button onClick={() => onLogin(UserRole.CLIENT)}>Get Started</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

const MobileNav: React.FC<{ user: User | null }> = ({ user }) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 glass-morphism h-20 flex items-center justify-around px-4 border-t border-slate-100 z-50">
    <Link to="/" className="flex flex-col items-center text-slate-400 hover:text-purple-600">
      <HomeIcon />
      <span className="text-[10px] mt-1 font-bold">Home</span>
    </Link>
    <Link to="/services" className="flex flex-col items-center text-slate-400 hover:text-purple-600">
      <GridIcon />
      <span className="text-[10px] mt-1 font-bold">Services</span>
    </Link>
    <Link to="/dashboard" className="flex flex-col items-center text-slate-400 hover:text-purple-600">
      <UserIcon />
      <span className="text-[10px] mt-1 font-bold">{user ? 'Dashboard' : 'Profile'}</span>
    </Link>
  </div>
);

const Home: React.FC<{ user: User | null }> = ({ user }) => (
  <div>
    <section className="relative overflow-hidden bg-white pt-20 pb-20 md:pt-32 md:pb-40">
      <div className="container mx-auto px-6 text-center">
        <Badge color="orange">Fast • Affordable • Reliable</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mt-6 leading-tight max-w-5xl mx-auto tracking-tighter">
          Hire <span className="text-orange-500">Expert</span> <span className="text-purple-600">Freelancers</span> In Minutes.
        </h1>
        <p className="text-slate-500 text-lg md:text-2xl mt-8 max-w-3xl mx-auto font-medium">
          The Swiggy of freelancing. Transparent pricing, lightning-fast delivery, and vetted creators for every business need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link to="/services">
            <Button className="w-full sm:w-auto h-16 text-xl px-10">Order a Service</Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto h-16 text-xl px-10">See Portfolios</Button>
        </div>
        
        <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="font-black text-2xl">TRUSTED PARTNERS</span>
          <span className="font-black text-2xl">SOLOPRENEUR</span>
          <span className="font-black text-2xl">CREATOR HUB</span>
        </div>
      </div>
    </section>

    <section className="bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <SectionTitle 
          title="Why ThatFreelancer?" 
          subtitle="We removed the friction from the hiring process."
          align="center"
        />
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <FeatureCard 
            icon="⚡" 
            title="Instant Ordering" 
            desc="Pick a service, share a brief, and relax. We take care of everything from matching to delivery." 
          />
          <FeatureCard 
            icon="💎" 
            title="Nominal Prices" 
            desc="No bidding wars. We offer fixed, market-competitive pricing that won't break the bank." 
          />
          <FeatureCard 
            icon="🤝" 
            title="Verified Talent" 
            desc="Only the top 5% of applicants make it as a 'ThatFreelancer' partner. Quality is our default." 
          />
        </div>
      </div>
    </section>

    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1">
            <Badge color="purple">Smart AI Integration</Badge>
            <h2 className="text-4xl md:text-6xl font-black mt-6 text-slate-900 leading-none tracking-tight">AI-Assisted <br/><span className="text-purple-600">Brief Creation</span></h2>
            <p className="text-slate-500 text-xl mt-8 leading-relaxed font-medium">
              Stuck on what to ask for? Our Gemini-powered AI turns your rough thoughts into high-converting professional briefs in seconds.
            </p>
            <ul className="mt-10 space-y-5">
              <li className="flex items-center gap-4 text-slate-800 font-bold text-lg">
                <CheckCircleIcon className="text-orange-500 w-6 h-6" /> Save 2+ hours per order
              </li>
              <li className="flex items-center gap-4 text-slate-800 font-bold text-lg">
                <CheckCircleIcon className="text-orange-500 w-6 h-6" /> Zero miscommunication
              </li>
              <li className="flex items-center gap-4 text-slate-800 font-bold text-lg">
                <CheckCircleIcon className="text-orange-500 w-6 h-6" /> Optimized for viral results
              </li>
            </ul>
          </div>
          <div className="flex-1 w-full max-w-xl">
             <div className="p-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[40px] shadow-2xl relative">
                <div className="absolute -top-6 -left-6 bg-orange-500 text-white p-4 rounded-2xl shadow-xl animate-bounce">
                   <span className="text-2xl font-bold">✨</span>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-inner">
                   <p className="text-xs text-purple-600 font-black mb-6 uppercase tracking-widest">Powered by Gemini AI</p>
                   <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <p className="text-slate-400 text-xs font-bold mb-1">USER INPUT</p>
                         <p className="text-slate-900 font-bold italic">"I need a bold logo for my startup called 'Flashy'..."</p>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                         <p className="text-purple-600 text-xs font-black mb-3">AI BRAINSTORMING...</p>
                         <div className="space-y-3">
                            <div className="h-3 bg-slate-100 rounded-full w-full"></div>
                            <div className="h-3 bg-slate-100 rounded-full w-5/6"></div>
                            <div className="h-3 bg-slate-100 rounded-full w-2/3"></div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const FeatureCard: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <Card className="text-center group hover:border-orange-200 hover:shadow-xl transition-all p-10 rounded-[32px]">
    <div className="text-5xl mb-8 bg-slate-50 w-24 h-24 flex items-center justify-center rounded-[30px] mx-auto group-hover:bg-orange-50 group-hover:scale-110 transition-all duration-300">{icon}</div>
    <h3 className="text-2xl font-black text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </Card>
);

const ServicesPage: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(SERVICES.map(s => s.category)))];
  const filteredServices = filter === 'All' ? SERVICES : SERVICES.filter(s => s.category === filter);

  return (
    <div className="container mx-auto px-6 py-12">
      <SectionTitle 
        title="Ready to Scale?" 
        subtitle="Transparent, nominal pricing. No hidden fees. Select a service to get started."
      />
      
      <div className="flex gap-4 mb-12 overflow-x-auto pb-6 hide-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`px-8 py-3 rounded-2xl whitespace-nowrap font-bold text-sm transition-all shadow-sm ${filter === cat ? 'bg-purple-600 text-white scale-105 shadow-purple-200' : 'bg-white text-slate-600 border border-slate-100 hover:border-purple-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredServices.map(service => (
          <Link key={service.id} to={`/services/${service.id}`}>
            <Card className="h-full group hover:-translate-y-2 transition-all p-8 rounded-[32px] border-slate-50">
              <div className="text-4xl mb-6">{service.icon}</div>
              <h4 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">{service.title}</h4>
              <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">{service.description}</p>
              <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                <span className="text-xs text-slate-400 font-black uppercase tracking-widest">{service.category}</span>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400 font-bold">Starts at</span>
                  <span className="text-xl font-black text-orange-500">${service.packages[0].price}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ServiceDetail: React.FC<{ user: User | null; onOrder: (o: Order) => void }> = ({ user, onOrder }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = SERVICES.find(s => s.id === id);
  const [selectedPkgId, setSelectedPkgId] = useState(service?.packages[0].id);
  const [briefInput, setBriefInput] = useState('');
  const [aiBrief, setAiBrief] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!service) return <div>Service not found</div>;

  const pkg = service.packages.find(p => p.id === selectedPkgId)!;

  const handleAiAssist = async () => {
    if (!briefInput) return;
    setIsGenerating(true);
    const res = await generateSmartBrief(service.title, briefInput);
    setAiBrief(res);
    setIsGenerating(false);
  };

  const handleOrder = () => {
    if (!user) {
      alert("Please login first!");
      return;
    }
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      serviceId: service.id,
      clientId: user.id,
      packageName: pkg.name,
      price: pkg.price,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      brief: aiBrief ? JSON.stringify(aiBrief) : briefInput
    };
    onOrder(newOrder);
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1">
          <Link to="/services" className="text-purple-600 font-black mb-8 inline-flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
             ← Back to Services
          </Link>
          <div className="flex items-center gap-6 mt-8">
            <span className="text-6xl">{service.icon}</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">{service.title}</h1>
          </div>
          <p className="text-slate-500 text-xl mt-8 leading-relaxed font-medium">{service.description}</p>

          <div className="mt-16">
            <h3 className="text-2xl font-black mb-8">Choose Your Plan</h3>
            <div className="grid gap-6">
              {service.packages.map(p => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPkgId(p.id)}
                  className={`p-8 rounded-[32px] border-2 cursor-pointer transition-all ${selectedPkgId === p.id ? 'border-purple-600 bg-purple-50/20 shadow-xl shadow-purple-100' : 'border-slate-100 bg-white hover:border-purple-200'}`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="font-black text-2xl text-slate-900">{p.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-slate-400 text-sm font-bold flex items-center gap-1">🕒 {p.deliveryTime}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-slate-400 text-sm font-bold flex items-center gap-1">🔄 {p.revisions === 0 ? 'No' : p.revisions} Revisions</span>
                      </div>
                    </div>
                    <span className="text-4xl font-black text-orange-500">${p.price}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {p.features.map(f => (
                      <div key={f} className="text-sm text-slate-600 font-bold flex items-center gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-500" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-[450px]">
          <div className="sticky top-24 bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50">
            <h3 className="text-2xl font-black mb-8">Project Brief</h3>
            
            <div className="mb-8">
               <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">What are we creating?</label>
               <textarea 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-base font-medium focus:ring-4 focus:ring-purple-50 focus:bg-white outline-none transition-all resize-none"
                  rows={5}
                  placeholder="Describe your goals, audience, and any preferences..."
                  value={briefInput}
                  onChange={(e) => setBriefInput(e.target.value)}
               />
               <button 
                  onClick={handleAiAssist}
                  disabled={isGenerating || !briefInput}
                  className="mt-4 text-sm font-black text-purple-600 flex items-center gap-2 hover:text-purple-700 disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? (
                    <span className="animate-pulse flex items-center gap-2">✨ Generating...</span>
                  ) : (
                    '✨ Optimize with Gemini AI'
                  )}
               </button>
            </div>

            {aiBrief && (
              <div className="mb-8 p-6 bg-purple-50 rounded-2xl border border-purple-100 animate-in slide-in-from-top-4 duration-500">
                <p className="text-[10px] font-black text-purple-600 mb-3 uppercase tracking-widest flex items-center gap-2">
                   <CheckCircleIcon className="w-3 h-3" /> AI Structured Brief Ready
                </p>
                <h4 className="font-black text-slate-900 text-base mb-2">{aiBrief.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-3">"{aiBrief.coreMessage}"</p>
              </div>
            )}

            <div className="space-y-4 mb-10 pt-6 border-t border-slate-50">
              <div className="flex justify-between text-slate-500 font-bold">
                <span>{pkg.name} Package</span>
                <span>${pkg.price}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Platform Fee</span>
                <span>$2</span>
              </div>
              <div className="flex justify-between text-3xl font-black pt-4 text-slate-900">
                <span>Total</span>
                <span className="text-orange-500">${pkg.price + 2}</span>
              </div>
            </div>

            <Button onClick={handleOrder} className="w-full h-16 text-lg" variant="secondary">Order Now</Button>
            <p className="text-center text-slate-400 text-[10px] mt-6 font-bold uppercase tracking-widest">Secure Checkout Powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ user: User | null; orders: Order[]; updateStatus: (id: string, s: OrderStatus) => void }> = ({ user, orders, updateStatus }) => {
  if (!user) return <div className="p-20 text-center">Please login to view dashboard</div>;

  const isAdmin = user.role === UserRole.ADMIN;
  const filteredOrders = isAdmin ? orders : orders.filter(o => o.clientId === user.id);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <SectionTitle 
          title={isAdmin ? "Admin Overview" : "Your Orders"} 
          subtitle={isAdmin ? "Track performance and manage deliveries." : "Manage your projects and download final files."} 
        />
        {isAdmin && (
           <div className="flex gap-4">
              <div className="bg-emerald-50 p-6 rounded-[24px] text-center min-w-[160px] border border-emerald-100 shadow-sm">
                 <p className="text-emerald-400 text-[10px] font-black mb-1 tracking-widest uppercase">Total Revenue</p>
                 <p className="text-3xl font-black text-emerald-600">${orders.reduce((acc, o) => acc + o.price, 0)}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-[24px] text-center min-w-[160px] border border-purple-100 shadow-sm">
                 <p className="text-purple-400 text-[10px] font-black mb-1 tracking-widest uppercase">Live Orders</p>
                 <p className="text-3xl font-black text-purple-600">{orders.length}</p>
              </div>
           </div>
        )}
      </div>

      <div className="grid gap-8">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-24 rounded-[40px] border-4 border-dashed border-slate-100 text-center">
            <p className="text-slate-300 text-2xl font-black">Ready to launch your first project?</p>
            <Link to="/services">
              <Button className="mt-8 h-14" variant="secondary">Browse Services</Button>
            </Link>
          </div>
        ) : (
          filteredOrders.map(order => (
            <Card key={order.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 p-10 rounded-[40px]">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-4xl shadow-inner">
                  {SERVICES.find(s => s.id === order.serviceId)?.icon}
                </div>
                <div>
                  <div className="flex items-center gap-4">
                    <h4 className="font-black text-2xl text-slate-900">{SERVICES.find(s => s.id === order.serviceId)?.title}</h4>
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 font-mono tracking-widest">#{order.id.toUpperCase()}</span>
                  </div>
                  <p className="text-slate-500 font-bold mt-1">Package: <span className="text-purple-600">{order.packageName}</span> • <span className="text-orange-500">${order.price}</span></p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
                <StatusBadge status={order.status} />
                
                {isAdmin ? (
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 ml-2 uppercase">Status</span>
                    <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-transparent border-none text-sm font-black p-2 rounded-xl focus:ring-0 cursor-pointer text-slate-900"
                    >
                        {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ) : (
                  order.status === OrderStatus.DELIVERED && (
                    <Button variant="secondary" className="h-12 px-8">Download Work</Button>
                  )
                )}
                
                <Button variant="outline" className="h-12 px-8">Chat Agent</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles = {
    [OrderStatus.PENDING]: "bg-amber-100 text-amber-700",
    [OrderStatus.IN_PROGRESS]: "bg-purple-100 text-purple-700",
    [OrderStatus.DELIVERED]: "bg-emerald-100 text-emerald-700",
    [OrderStatus.REVISION]: "bg-rose-100 text-rose-700"
  };
  return (
    <span className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
};

const Checkout: React.FC<{ onOrder: (o: Order) => void }> = () => <div>Checkout Page (TBD)</div>;

const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-white py-24 px-6 pb-40 md:pb-24 mt-20">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2">
          <Logo className="text-3xl mb-8" />
          <p className="text-slate-400 mt-6 max-w-sm leading-relaxed font-medium">
            The Zomato/Swiggy of the gig economy. Ordering creative services has never been this simple, transparent, or fast.
          </p>
          <div className="flex gap-6 mt-10">
            {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
              <a key={s} href="#" className="text-slate-500 hover:text-white transition-colors font-bold text-sm tracking-widest uppercase">{s}</a>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-black mb-8 text-xs uppercase tracking-[0.2em] text-orange-500">Services</h5>
          <ul className="space-y-4 text-slate-400 font-bold">
            {['Graphic Design', 'Copywriting', 'Content Writing', 'Social Media'].map(s => (
              <li key={s}><Link to="/services" className="hover:text-purple-400 transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-black mb-8 text-xs uppercase tracking-[0.2em] text-orange-500">Legal</h5>
          <ul className="space-y-4 text-slate-400 font-bold">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Contact Us'].map(l => (
              <li key={l}><a href="#" className="hover:text-purple-400 transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-20 pt-10 text-center text-slate-600 text-xs font-black tracking-widest uppercase">
        © {new Date().getFullYear()} ThatFreelancer Marketplace. All rights reserved.
      </div>
    </div>
  </footer>
);

// --- Icons ---
const LogOutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const GridIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default App;
