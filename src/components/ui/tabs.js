import * as React from "react";
import { View, Text, StyleSheet, Pressable } from 'react-native';

const Tabs = ({ value, onValueChange, children }) => {
  return <View style={styles.tabs}>{children}</View>;
};

const TabsList = React.forwardRef(({ style, ...props }, ref) => (
  <View
    ref={ref}
    style={[styles.list, style]}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ style, active, value, onPress, children, ...props }, ref) => (
  <Pressable
    ref={ref}
    style={[
      styles.trigger,
      active ? styles.triggerActive : null,
      style
    ]}
    onPress={() => onPress && onPress(value)}
    {...props}
  >
    <Text style={active ? styles.triggerTextActive : styles.triggerText}>
      {children}
    </Text>
  </Pressable>
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ style, active, value, ...props }, ref) => (
  active ? (
    <View
      ref={ref}
      style={[styles.content, style]}
      {...props}
    />
  ) : null
));
TabsContent.displayName = "TabsContent";

const styles = StyleSheet.create({
  tabs: {
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    display: 'inline-flex',
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    padding: 4,
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  triggerActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  triggerText: {
    color: '#64748b',
  },
  triggerTextActive: {
    color: '#0f172a',
  },
  content: {
    marginTop: 8,
  }
});

export { Tabs, TabsList, TabsTrigger, TabsContent };
