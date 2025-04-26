import * as React from "react";
import { View, Text, StyleSheet } from 'react-native';

const Card = React.forwardRef(({ style, ...props }, ref) => (
  <View
    ref={ref}
    style={[styles.card, style]}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ style, ...props }, ref) => (
  <View
    ref={ref}
    style={[styles.header, style]}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ style, ...props }, ref) => (
  <Text
    ref={ref}
    style={[styles.title, style]}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ style, ...props }, ref) => (
  <Text
    ref={ref}
    style={[styles.description, style]}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.content, style]} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ style, ...props }, ref) => (
  <View
    ref={ref}
    style={[styles.footer, style]}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 0,
  }
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
