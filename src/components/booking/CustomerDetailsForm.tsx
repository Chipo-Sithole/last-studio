import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CustomerDetails } from '@/types/booking';

const customerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  notes: z.string().optional(),
});

interface CustomerDetailsFormProps {
  initialData?: CustomerDetails | null;
  onSubmit: (data: CustomerDetails) => void;
  formId: string;
}

export const CustomerDetailsForm = ({
  initialData,
  onSubmit,
  formId,
}: CustomerDetailsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerDetails>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  return (
    <motion.form
      id={formId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="Jane"
            className="h-12 rounded-xl border-border focus:border-primary focus:ring-primary/20"
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Doe"
            className="h-12 rounded-xl border-border focus:border-primary focus:ring-primary/20"
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="jane@example.com"
          className="h-12 rounded-xl border-border focus:border-primary focus:ring-primary/20"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="(555) 123-4567"
          className="h-12 rounded-xl border-border focus:border-primary focus:ring-primary/20"
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Special Requests <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Any allergies, preferences, or special requests..."
          className="min-h-[100px] rounded-xl border-border focus:border-primary focus:ring-primary/20 resize-none"
        />
      </div>
    </motion.form>
  );
};
