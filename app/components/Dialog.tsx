import { useState, forwardRef, createContext, useContext } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

// Centralizes dialog control
export const useDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const close = () => setIsDialogOpen(false);
  const open = () => setIsDialogOpen(true);

  // Dialog type
  const [dialogType, setDialogType] = useState<DialogType>('dropIn');
  const setType = (type: DialogType) => setDialogType(type);

  return {
    isDialogOpen,
    closeDialog: close,
    openDialog: open,
    dialogType,
    setDialogType: setType,
  };
};

const DialogContext = createContext<ContextProps | undefined>(undefined);

const DialogContent = forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, ...props }, ref) => {
    const context = useContext(DialogContext);

    if (context === undefined) {
      throw new Error('DialogContent must be used within a DialogOverlay');
    }

    return (
      <motion.div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        variants={variants[context.type]}
        initial="hidden"
        animate="visible"
        exit="exit"
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

export const Dialog = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<'div'> & ContextProps
>(({ handleClose, type, children, ...props }, ref) => {
  return (
    <motion.div
      className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center overflow-hidden bg-black/70"
      onClick={handleClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <DialogContext.Provider value={{ handleClose, type }}>
        <DialogContent ref={ref} {...props}>
          {children}
        </DialogContent>
      </DialogContext.Provider>
    </motion.div>
  );
});

export const DialogCloseButton = forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithRef<'button'>, 'aria-label' | 'title'> & {
    label?: string;
  }
>(({ children, ...props }, ref) => {
  const context = useContext(DialogContext);

  if (context === undefined) {
    throw new Error('DialogButton must be used within a DialogOverlay');
  }

  return (
    <button
      ref={ref}
      aria-label="Close dialog"
      title="Close dialog"
      onClick={context.handleClose}
      {...props}
    >
      {children}
    </button>
  );
});

// motion variants
const variants = {
  dropIn: {
    hidden: {
      y: '-100vh',
      opacity: 0,
    },
    visible: {
      y: '0',
      opacity: 1,
      transition: {
        duration: 0.1,
        type: 'spring',
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: '20vh',
      opacity: 0,
    },
  },

  gifYouUp: {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.15,
        ease: 'easeOut',
      },
    },
  },
};

// Typings
export type DialogType = 'dropIn' | 'gifYouUp';

export type DialogControl = {
  dialogOpen: boolean;
  closeDialog: () => void;
  openDialog: () => void;
  dialogType: DialogType;
  setDialogType: (type: DialogType) => void;
};

type ContextProps = {
  handleClose: () => void;
  type: DialogType;
};
