import * as React from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Table = React.forwardRef(({ style, ...props }, ref) => (
  <View style={styles.tableWrapper}>
    <ScrollView horizontal style={styles.tableScroll}>
      <View
        ref={ref}
        style={[styles.table, style]}
        {...props}
      />
    </ScrollView>
  </View>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.tableHeader, style]} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.tableBody, style]} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.tableFooter, style]} {...props} />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.tableRow, style]} {...props} />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.tableHead, style]} {...props} />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.tableCell, style]} {...props} />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.tableCaption, style]} {...props} />
));
TableCaption.displayName = "TableCaption";

const styles = StyleSheet.create({
  tableWrapper: {
    position: 'relative',
    width: '100%',
  },
  tableScroll: {
    overflow: 'auto',
  },
  table: {
    width: '100%',
    captionSide: 'bottom',
    fontSize: 14,
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableBody: {},
  tableFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: 'rgba(241, 245, 249, 0.5)',
    fontWeight: '500',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableHead: {
    height: 48,
    paddingHorizontal: 16,
    textAlign: 'left',
    verticalAlign: 'middle',
    fontWeight: '500',
    color: '#64748b',
  },
  tableCell: {
    padding: 16,
    verticalAlign: 'middle',
  },
  tableCaption: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748b',
  },
});

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
