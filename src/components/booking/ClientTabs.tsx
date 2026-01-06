import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientBooking } from '@/types/booking';
import { cn } from '@/lib/utils';

interface ClientTabsProps {
  clients: ClientBooking[];
  activeClientId: string;
  onClientSelect: (clientId: string) => void;
  onAddClient: () => void;
  onRemoveClient: (clientId: string) => void;
  maxClients?: number;
}

export const ClientTabs = ({
  clients,
  activeClientId,
  onClientSelect,
  onAddClient,
  onRemoveClient,
  maxClients = 4,
}: ClientTabsProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {clients.map((client, index) => (
        <motion.button
          key={client.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={() => onClientSelect(client.id)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap",
            activeClientId === client.id
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <span>{client.label}</span>
          {client.service && (
            <span className="text-[10px] opacity-75 font-normal">
              ({client.service.name.split(' ')[0]})
            </span>
          )}
          
          {clients.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveClient(client.id);
              }}
              className={cn(
                "ml-1 w-4 h-4 rounded-full flex items-center justify-center transition-colors",
                activeClientId === client.id
                  ? "hover:bg-primary-foreground/20"
                  : "hover:bg-foreground/10"
              )}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </motion.button>
      ))}
      
      {clients.length < maxClients && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddClient}
          className="rounded-xl border-dashed gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add another set</span>
          <span className="sm:hidden">Add</span>
        </Button>
      )}
    </div>
  );
};
