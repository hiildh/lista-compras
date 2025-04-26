import React from "react";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

const Toaster = ({ ...props }) => {
    const { theme = "system" } = useTheme();

    const styles = {
        toaster: {
            backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
            color: theme === "dark" ? "#f5f5f5" : "#000000",
            border: theme === "dark" ? "1px solid #333333" : "1px solid #dddddd",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        toast: {
            color: theme === "dark" ? "#cccccc" : "#666666",
        },
        actionButton: {
            backgroundColor: theme === "dark" ? "#007bff" : "#0056b3",
            color: "#ffffff",
        },
        cancelButton: {
            backgroundColor: theme === "dark" ? "#6c757d" : "#e9ecef",
            color: theme === "dark" ? "#ffffff" : "#495057",
        },
    };

    return (
        <Sonner
            theme={theme}
            className="toaster"
            toastOptions={{
                classNames: {
                    toast: styles.toast,
                    description: styles.toast,
                    actionButton: styles.actionButton,
                    cancelButton: styles.cancelButton,
                },
            }}
            {...props}
        />
    );
};

export { Toaster };