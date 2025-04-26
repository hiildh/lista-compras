import * as React from "react";
import { View, Pressable, StyleSheet } from 'react-native';
import { Check } from "lucide-react";

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
  <Pressable
    ref={ref}
    style={[
      styles.checkbox,
      checked ? styles.checked : styles.unchecked,
      disabled ? styles.disabled : null
    ]}
    onPress={() => !disabled && onCheckedChange && onCheckedChange(!checked)}
    disabled={disabled}
    {...props}
  >
    {checked && (
      <Check style={styles.checkIcon} size={16} />
    )}
  </Pressable>
));

Checkbox.displayName = "Checkbox";

const styles = StyleSheet.create({
  checkbox: {
    height: 16,
    width: 16,
    flexShrink: 0,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#9b87f5',
    borderColor: '#9b87f5',
  },
  unchecked: {
    backgroundColor: 'transparent',
    borderColor: '#9b87f5',
  },
  disabled: {
    opacity: 0.5,
  },
  checkIcon: {
    color: 'white',
  }
});

export { Checkbox };
