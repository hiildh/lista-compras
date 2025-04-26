import * as React from "react";
import { View, Text, StyleSheet } from 'react-native';

const TooltipProvider = ({ children }) => {
  return <View>{children}</View>;
};

const Tooltip = ({ children, open, onOpenChange }) => {
  return (
    <View style={styles.tooltipWrapper}>
      {children}
    </View>
  );
};

const TooltipTrigger = React.forwardRef(({ children, ...props }, ref) => (
  <View
    ref={ref}
    {...props}
  >
    {children}
  </View>
));
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <View
    ref={ref}
    style={styles.content}
    {...props}
  />
));
TooltipContent.displayName = "TooltipContent";

const styles = StyleSheet.create({
  tooltipWrapper: {
    position: 'relative',
  },
  content: {
    zIndex: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }
});

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
