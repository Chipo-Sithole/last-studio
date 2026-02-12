import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ProgressIndicator } from './ProgressIndicator';
import { ServiceCard } from './ServiceCard';
import { ClientTabs } from './ClientTabs';
import { DateSelection } from './DateSelection';
import { TimeSlotSelection } from './TimeSlotSelection';
import { AddOnSelection } from './AddOnSelection';
import { CustomerDetailsForm } from './CustomerDetailsForm';
import { BookingReview } from './BookingReview';
import { BookingSummary } from './BookingSummary';
import { ConfirmationScreen } from './ConfirmationScreen';
import { useServices, useAddOns, useCreateAppointment, useAvailableSlots } from '@/hooks/useApi';
import { ClientBooking, CustomerDetails, Service, AddOn, BookingData } from '@/types/booking';
import { toast } from 'sonner';
import { format } from 'date-fns';

const STEPS = [
  { id: 'services', label: 'Services' },
  { id: 'date', label: 'Date' },
  { id: 'time', label: 'Time' },
  { id: 'addons', label: 'Add-ons' },
  { id: 'details', label: 'Details' },
  { id: 'review', label: 'Review' },
];

const createClient = (index: number): ClientBooking => ({
  id: `client-${Date.now()}-${index}`,
  label: `Client ${index + 1}`,
  service: null,
  addOns: [],
});

interface BookingFlowProps {
  onBackToLanding: () => void;
  preselectedServiceId?: string | null;
}

export const BookingFlow = ({ onBackToLanding, preselectedServiceId }: BookingFlowProps) => {
  // Fetch data from API
  const { data: services = [], isLoading: servicesLoading, error: servicesError } = useServices();
  const { data: addOns = [], isLoading: addOnsLoading } = useAddOns();
  const createAppointment = useCreateAppointment();
  
  const initialClient = useMemo(() => createClient(0), []);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [clients, setClients] = useState<ClientBooking[]>([initialClient]);
  const [activeClientId, setActiveClientId] = useState(initialClient.id);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  // Set preselected service after services load
  useEffect(() => {
    if (preselectedServiceId && services.length > 0 && !clients[0].service) {
      const preselectedService = services.find(s => s.id === preselectedServiceId);
      if (preselectedService) {
        setClients(prev => prev.map((c, index) => 
          index === 0 ? { ...c, service: preselectedService } : c
        ));
      }
    }
  }, [preselectedServiceId, services, clients]);

  const activeClient = clients.find(c => c.id === activeClientId);
  
  // Fetch available time slots for selected date
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const { data: timeSlots = [], isLoading: timeSlotsLoading } = useAvailableSlots(formattedDate);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: // Services
        return clients.every(c => c.service !== null);
      case 1: // Date
        return selectedDate !== null;
      case 2: // Time
        return selectedTime !== null;
      case 3: // Add-ons
        return true; // Optional
      case 4: // Details
        return false; // Handled by form submission
      case 5: // Review
        return true;
      default:
        return false;
    }
  }, [currentStep, clients, selectedDate, selectedTime]);

  const handleServiceSelect = (service: Service) => {
    setClients(prev => prev.map(c => 
      c.id === activeClientId ? { ...c, service } : c
    ));
  };

  const handleAddClient = () => {
    const newClient = createClient(clients.length);
    setClients(prev => [...prev, newClient]);
    setActiveClientId(newClient.id);
  };

  const handleRemoveClient = (clientId: string) => {
    if (clients.length <= 1) return;
    
    setClients(prev => {
      const filtered = prev.filter(c => c.id !== clientId);
      // Relabel remaining clients
      return filtered.map((c, i) => ({ ...c, label: `Client ${i + 1}` }));
    });
    
    if (activeClientId === clientId) {
      setActiveClientId(clients[0].id === clientId ? clients[1]?.id : clients[0].id);
    }
  };

  const handleToggleAddOn = (addOn: AddOn) => {
    setClients(prev => prev.map(c => {
      if (c.id !== activeClientId) return c;
      
      const hasAddOn = c.addOns.some(a => a.id === addOn.id);
      return {
        ...c,
        addOns: hasAddOn
          ? c.addOns.filter(a => a.id !== addOn.id)
          : [...c.addOns, addOn],
      };
    }));
  };

  const handleDetailsSubmit = (details: CustomerDetails) => {
    setCustomerDetails(details);
    setCurrentStep(5);
  };

  const handleConfirmBooking = async () => {
    if (!customerDetails || !selectedDate || !selectedTime) {
      toast.error('Missing required booking information');
      return;
    }

    // Format date as YYYY-MM-DD
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');

    // Prepare booking data
    const bookingData: BookingData = {
      customer: {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        location: customerDetails.location,
        needsTransport: customerDetails.needsTransport || false,
        isReturning: customerDetails.isReturning || false,
      },
      date: formattedDate,
      timeSlot: selectedTime,
      clients: clients.map(client => ({
        serviceId: client.service!.id,
        addOns: client.addOns.map(addon => addon.id),
      })),
      notes: customerDetails.notes,
    };

    try {
      const response = await createAppointment.mutateAsync(bookingData);
      setConfirmationCode(response.confirmation_code);
      setIsConfirmed(true);
      toast.success('Booking confirmed successfully!');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to create booking. Please try again.');
    }
  };

  const handleNewBooking = () => {
    setCurrentStep(0);
    const newClient = createClient(0);
    setClients([newClient]);
    setActiveClientId(newClient.id);
    setSelectedDate(null);
    setSelectedTime(null);
    setCustomerDetails(null);
    setIsConfirmed(false);
    setConfirmationCode(null);
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1 && canProceed) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 5) {
      handleConfirmBooking();
    }
  };

  const handleHeaderBack = () => {
    if (isConfirmed) {
      handleNewBooking();
    } else if (currentStep === 0) {
      onBackToLanding();
    } else {
      goBack();
    }
  };

  // Loading state
  if (servicesLoading || addOnsLoading) {
    return (
      <>
        <Header onBack={onBackToLanding} />
        <div className="min-h-screen gradient-luxury">
          <div className="container max-w-lg py-8 px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Loading services...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (servicesError) {
    return (
      <>
        <Header onBack={onBackToLanding} />
        <div className="min-h-screen gradient-luxury">
          <div className="container max-w-lg py-8 px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <p className="text-destructive font-medium">Failed to load services</p>
                <p className="text-sm text-muted-foreground">
                  Please check your connection and try again
                </p>
                <Button onClick={onBackToLanding}>Back to Home</Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isConfirmed && customerDetails && selectedDate && selectedTime) {
    return (
      <>
        <Header onBack={handleHeaderBack} />
        <div className="min-h-screen gradient-luxury">
          <div className="container max-w-lg py-8 px-4">
            <ConfirmationScreen
              clients={clients}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              customerDetails={customerDetails}
              confirmationCode={confirmationCode || undefined}
              onNewBooking={handleNewBooking}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onBack={handleHeaderBack} />
      <div className="min-h-screen gradient-luxury pb-32">
        <div className="container max-w-2xl py-6 px-4">
          {/* Progress */}
          <ProgressIndicator steps={STEPS} currentStep={currentStep} />

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="py-6"
          >
            {/* Step 0: Services */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="font-sans text-3xl font-normal text-foreground">
                    Choose Your Look
                  </h1>
                  <p className="text-muted-foreground">
                    Select the perfect lash set for each client
                  </p>
                </div>

                <ClientTabs
                  clients={clients}
                  activeClientId={activeClientId}
                  onClientSelect={setActiveClientId}
                  onAddClient={handleAddClient}
                  onRemoveClient={handleRemoveClient}
                />

                <div className="grid gap-4">
                  {(() => {
                    const sortedServices = preselectedServiceId
                      ? [
                          ...services.filter(s => s.id === preselectedServiceId),
                          ...services.filter(s => s.id !== preselectedServiceId)
                        ]
                      : services;
                    
                    return sortedServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        isSelected={activeClient?.service?.id === service.id}
                        onSelect={handleServiceSelect}
                      />
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Step 1: Date */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="font-sans text-3xl font-normal text-foreground">
                    Pick a Date
                  </h1>
                  <p className="text-muted-foreground">
                    Select your preferred appointment date
                  </p>
                </div>

                <DateSelection
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>
            )}

            {/* Step 2: Time */}
            {currentStep === 2 && selectedDate && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="font-sans text-3xl font-normal text-foreground">
                    Choose a Time
                  </h1>
                  <p className="text-muted-foreground">
                    Available slots for your selected date
                  </p>
                </div>

                {timeSlotsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">Loading available times...</p>
                    </div>
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No available time slots for this date</p>
                  </div>
                ) : (
                  <TimeSlotSelection
                    slots={timeSlots}
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                  />
                )}
              </div>
            )}

            {/* Step 3: Add-ons */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="font-sans text-3xl font-normal text-foreground">
                    Enhance Your Experience
                  </h1>
                  <p className="text-muted-foreground">
                    Optional add-ons to complete your look
                  </p>
                </div>

                <ClientTabs
                  clients={clients}
                  activeClientId={activeClientId}
                  onClientSelect={setActiveClientId}
                  onAddClient={handleAddClient}
                  onRemoveClient={handleRemoveClient}
                />

                {activeClient && (
                  <AddOnSelection
                    addOns={addOns}
                    selectedAddOns={activeClient.addOns}
                    onToggleAddOn={handleToggleAddOn}
                    clientLabel={activeClient.label}
                  />
                )}
              </div>
            )}

            {/* Step 4: Customer Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="font-sans text-3xl font-normal text-foreground">
                    Your Details
                  </h1>
                  <p className="text-muted-foreground">
                    Contact information for booking confirmation
                  </p>
                </div>

                <CustomerDetailsForm
                  initialData={customerDetails}
                  onSubmit={handleDetailsSubmit}
                  formId="customer-details-form"
                />
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && customerDetails && selectedDate && selectedTime && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="font-sans text-3xl font-normal text-foreground">
                    Review Your Booking
                  </h1>
                  <p className="text-muted-foreground">
                    Please confirm your appointment details
                  </p>
                </div>

                <BookingReview
                  clients={clients}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  customerDetails={customerDetails}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-4 z-50">
          <div className="container max-w-2xl flex items-center gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={goBack}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            {currentStep === 4 ? (
              <Button
                type="submit"
                form="customer-details-form"
                variant="luxury"
                size="lg"
                className="flex-1"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="luxury"
                size="lg"
                onClick={goNext}
                disabled={!canProceed || (currentStep === 5 && createAppointment.isPending)}
                className="flex-1"
              >
                {createAppointment.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {currentStep === 5 ? 'Confirm Booking' : 'Continue'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
};
