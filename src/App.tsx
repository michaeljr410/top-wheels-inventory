import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Inventory } from '@/components/Inventory';
import { GetStartedModal } from '@/components/GetStartedModal';
import { Footer } from '@/components/Footer';
import type { Vehicle } from '@/data/types';

function App() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleGetStarted = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Small delay to let animation finish before clearing vehicle
    setTimeout(() => setSelectedVehicle(null), 300);
  };

  return (
    <>
      <Navbar />
      <Hero />
      <Inventory onGetStarted={handleGetStarted} />
      <Footer />

      <GetStartedModal
        vehicle={selectedVehicle}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default App;
