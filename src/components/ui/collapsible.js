import * as React from "react";
import { View, StyleSheet, Pressable } from 'react-native';

const Collapsible = ({ open, onOpenChange, children }) => {
  return <View style={styles.collapsible}>{children}</View>;
};

const CollapsibleTrigger = ({ children, onPress }) => {
  return (
    <Pressable style={styles.trigger} onPress={onPress}>
      {children}
    </Pressable>
  );
};

const CollapsibleContent = ({ open, children }) => {
  if (!open) return null;
  
  return (
    <View style={styles.content}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  collapsible: {
    width: '100%',
  },
  trigger: {
    cursor: 'pointer',
  },
  content: {
    overflow: 'hidden',
  }
});

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
