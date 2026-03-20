import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, Calendar } from 'lucide-react';
import { BookingsChart } from './components/bookings-chart';
import { ServiceDistribution } from './components/service-distribution';
import { NearbyRequests } from './components/nearby-requests';
import { RevenueCard, ActiveUsers } from './components/revenue-stats';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, delay }
  })
};

export const DashboardPage: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
      {/* Welcome Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-card/50 border border-white/5 p-12 md:p-16">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-6 border border-primary/20"
          >
            <Sparkles className="w-3 h-3 fill-primary" />
            <span>Panel de Control Premium</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-4xl md:text-6xl font-bold font-heading tracking-tight text-white mb-6"
          >
            Bienvenido de nuevo a <span className="text-primary font-heading-italic italic">KuinTwin Admin</span>.
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-lg text-muted-foreground/80 leading-relaxed mb-10 max-w-xl"
          >
            Gestiona tus servicios, monitorea las reservas en tiempo real y optimiza el rendimiento de tu negocio desde un solo lugar.
          </motion.p>

          <motion.div 
             variants={fadeUp}
             initial="hidden"
             animate="visible"
             custom={0.3}
             className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Ingresos', value: '+12.4%', icon: TrendingUp },
              { label: 'Usuarios', value: '2.5k', icon: Users },
              { label: 'Reservas', value: '148', icon: Calendar },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-xl font-black text-white">{stat.value}</span>
                </div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Quick Cards? (Maybe later) */}

      {/* Top Section: Monthly Bookings & Distribution */}
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          <BookingsChart />
        </div>
        <div className="col-span-4">
          <ServiceDistribution />
        </div>
      </div>

      {/* Bottom Section: Nearby Requests & Stats */}
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          <NearbyRequests />
        </div>
        <div className="col-span-4 flex flex-col gap-10">
          <div className="flex-1 min-h-[220px]">
            <RevenueCard />
          </div>
          <div className="flex-1">
            <ActiveUsers />
          </div>
        </div>
      </div>
    </div>
  );
};
