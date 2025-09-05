import { useMutation, useQueryClient } from '@tanstack/react-query';

import { showError, showMessage, signUp, forgotPassword, resetPassword, updProfile, changePassword } from 'utils/apis';

export const useSignUp = (onSuccessCallback) => {
    return useMutation({
        mutationFn: signUp,
        onSuccess: (data) => {
            if (data) showMessage(data?.message);
            onSuccessCallback(data)
        },
        onError: (error) => {
            showError(error)
        },
    });
};

export const useForgotPassword = (onSuccessCallback) => {
    return useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            if (data?.message.status == 'failed') {
                showMessage(data?.message?.message, 'error');
            } else {
                if (data) showMessage(data?.message?.message);
                onSuccessCallback(data?.data)
            }
        },
        onError: (error) => {
            showError(error)
        },
    });
};

export const useResetPassword = (onSuccessCallback) => {
    return useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            if (data?.message.status == 'failed') {
                showMessage(data?.message?.message, 'error');
            } else {
                if (data) showMessage(data?.message?.message);
                onSuccessCallback(data)
            }
        },
        onError: (error) => {
            showError(error)
        },
    });
};

export const useUpdProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updProfile,
        onSuccess: (data) => {
            if (data.message.status === "failed") {
                showMessage(data?.message?.message, "error");
            } else {
                queryClient.invalidateQueries({ queryKey: ['profile'] })
                showMessage(data?.message?.message);
            }
        },
        onError: (error) => {
            showError(error)
        },
    });
};

export const useChangePassword = (onSuccessCallback) => {
    return useMutation({
        mutationFn: changePassword,
        onSuccess: (data) => {
            if (data.message.status === "failed") {
                showMessage(data?.message?.message, "error");
            } else {
                onSuccessCallback(data)
                showMessage(data?.message?.message);
            }
        },
        onError: (error) => {
            showError(error)
        },
    });
};