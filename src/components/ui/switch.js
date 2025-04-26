import * as React from "react";
import { View, StyleSheet, Pressable } from 'react-native';

const Switch = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => (
  <Pressable
    ref={ref}
    style={[
      styles.switch,
      checked ? styles.checked : styles.unchecked
    ]}
    onPress={() => onCheckedChange && onCheckedChange(!checked)}
    {...props}
  >
    <View
      style={[
        styles.thumb,
        checked ? styles.thumbChecked : styles.thumbUnchecked
      ]}
    />
  </Pressable>
));

Switch.displayName = "Switch";

const styles = StyleSheet.create({
  switch: {
    display: 'inline-flex',
    height: 24,
    width: 44,
    flexShrink: 0,
    cursor: 'pointer',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'transparent',
    transition: '0.2s',
  },
  checked: {
    backgroundColor: '#9b87f5',
  },
  unchecked: {
    backgroundColor: '#e2e8f0',
  },
  thumb: {
    pointerEvents: 'none',
    display: 'block',
    height: 20,
    width: 20,
    borderRadius: 999,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    transition: 'transform 0.2s',
  },
  thumbChecked: {
    transform: [{ translateX: 20 }],
  },
  thumbUnchecked: {
    transform: [{ translateX: 0 }],
  }
});

export { Switch };
