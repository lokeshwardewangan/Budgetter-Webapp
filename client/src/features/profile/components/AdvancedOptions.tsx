import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import SessionsPopover from '@/features/sessions/components/SessionsPopover';
import { useDialogState } from '@/shared/hooks/useDialogState';
import DeleteAccountDialog from './DeleteAccountDialog';

export default function AdvancedOptions() {
  const { isOpen, setIsOpen } = useDialogState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleContent className="mt-4 space-y-2">
        <div className="grid grid-cols-1 gap-4">
          <SessionsPopover />
          <DeleteAccountDialog />
        </div>
      </CollapsibleContent>
      <CollapsibleTrigger className="mt-5" asChild>
        <Button variant="outline" className="w-full">
          <Settings2 className="mr-2 h-4 w-4" />
          Advance Options
          {!isOpen ? <ChevronUp className="ml-1 h-5 w-5" /> : <ChevronDown className="ml-1 h-5 w-5" />}
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
}
