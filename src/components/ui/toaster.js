import React from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
        {toasts.map(({ id, title, description, action, ...props }) => (
            <Toast key={id} {...props}>
            <View style={{ gap: 4 }}>
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
            </View>
            {action}
            <ToastClose />
            </Toast>
        ))}
        <ToastViewport />
        </ToastProvider>
    );
}
