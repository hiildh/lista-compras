import * as React from "react";
import { TextInput, StyleSheet } from 'react-native';

const Textarea = React.forwardRef(({ style, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      style={[styles.textarea, style]}
      multiline={true}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  }
});

export { Textarea };
