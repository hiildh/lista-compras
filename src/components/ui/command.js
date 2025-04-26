import * as React from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Search } from "lucide-react";

const Command = React.forwardRef(({ style, ...props }, ref) => (
  <View
    ref={ref}
    style={[styles.command, style]}
    {...props}
  />
));
Command.displayName = "Command";

const CommandInput = React.forwardRef(({ style, ...props }, ref) => (
  <View style={styles.inputWrapper}>
    <Search style={styles.searchIcon} size={16} />
    <TextInput
      ref={ref}
      style={[styles.input, style]}
      {...props}
    />
  </View>
));
CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef(({ style, ...props }, ref) => (
  <ScrollView
    ref={ref}
    style={[styles.list, style]}
    {...props}
  />
));
CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef((props, ref) => (
  <View
    ref={ref}
    style={styles.empty}
    {...props}
  >
    <Text style={styles.emptyText}>No results found.</Text>
  </View>
));
CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = React.forwardRef(({ style, label, ...props }, ref) => (
  <View ref={ref} style={[styles.group, style]}>
    {label && <Text style={styles.groupHeading}>{label}</Text>}
    <View {...props} />
  </View>
));
CommandGroup.displayName = "CommandGroup";

const CommandItem = React.forwardRef(({ style, active, ...props }, ref) => (
  <View
    ref={ref}
    style={[
      styles.item,
      active ? styles.itemActive : null,
      style
    ]}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";

const CommandSeparator = React.forwardRef(({ style, ...props }, ref) => (
  <View
    ref={ref}
    style={[styles.separator, style]}
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

const CommandShortcut = ({ style, ...props }) => {
  return (
    <Text style={[styles.shortcut, style]} {...props} />
  );
};
CommandShortcut.displayName = "CommandShortcut";

const styles = StyleSheet.create({
  command: {
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    padding: 12,
    fontSize: 14,
    outline: 'none',
  },
  list: {
    maxHeight: 300,
    overflow: 'auto',
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748b',
  },
  group: {
    overflow: 'hidden',
    padding: 4,
  },
  groupHeading: {
    padding: 8,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  item: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    outline: 'none',
  },
  itemActive: {
    backgroundColor: '#f1f5f9',
  },
  separator: {
    height: 1,
    marginHorizontal: -4,
    backgroundColor: '#e2e8f0',
  },
  shortcut: {
    marginLeft: 'auto',
    fontSize: 12,
    letterSpacing: 0.5,
    color: '#64748b',
  },
});

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
