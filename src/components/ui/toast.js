import * as React from "react";
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { X } from "lucide-react";

const ToastProvider = ({ children }) => {
  return <View style={styles.provider}>{children}</View>;
};

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <View 
    ref={ref}
    style={styles.viewport}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

const Toast = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <View
      ref={ref}
      style={[
        styles.toast,
        variant === "destructive" ? styles.destructive : null
      ]}
      {...props}
    />
  );
});
Toast.displayName = "Toast";

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <Pressable
    ref={ref}
    style={styles.action}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <Pressable
    ref={ref}
    style={styles.close}
    {...props}
  >
    <X style={styles.closeIcon} />
  </Pressable>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    style={styles.title}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    style={styles.description}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

const styles = StyleSheet.create({
  provider: {
    position: 'relative',
    zIndex: 100,
  },
  viewport: {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column-reverse',
    padding: 16,
    width: '100%',
    maxHeight: '100vh',
  },
  toast: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingRight: 32,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  destructive: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  action: {
    flexShrink: 0,
    marginLeft: 16,
    height: 32,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    borderRadius: 4,
  },
  closeIcon: {
    height: 16,
    width: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.9,
  }
});

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
