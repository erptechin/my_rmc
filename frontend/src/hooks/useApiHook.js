import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { showError, showMessage, getInfo, getListData, getSingleData, addData, updateData, deleteData } from 'utils/apis';
import { useAuthContext } from "app/contexts/auth/context";

function dataKey(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, '-');
}

export const useInfo = (params) => {
    const { isAuthenticated } = useAuthContext();
    return useQuery({
        queryKey: [dataKey(params.doctype), params],
        queryFn: () => getInfo(params),
        enabled: isAuthenticated
    });
};

export const useFeachData = (params) => {
    const { isAuthenticated } = useAuthContext();
    return useQuery({
        queryKey: [dataKey(params.doctype), params],
        queryFn: () => getListData(params),
        enabled: isAuthenticated && !!params?.fields
    });
};

export const useFeachSingle = (params) => {
    const { isAuthenticated } = useAuthContext();
    return useQuery({
        queryFn: () => getSingleData(params),
        enabled: isAuthenticated && !!params.id && !!params.fields,
        select: (data) => {
            return data
        },
    });
};

export const useAddData = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    // custom_branch
    return useMutation({
        mutationFn: (params) => {
            return addData(params)
        },
        onSuccess: (data, variable) => {
            if (data) showMessage(`${variable.doctype} add successfully`);
            onSuccessCallback(data)
            queryClient.invalidateQueries({ queryKey: [dataKey(variable.doctype)] });
        },
        onError: (error) => {
            showError(error)
        },
    });
};

export const useUpdateData = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params) => {
            delete params.creation
            // delete params.modified  // Don't delete modified field - it's needed for version control
            return updateData(params)
        },
        onSuccess: (data, variable) => {
            if (data) showMessage(`${variable.doctype} update successfully`);
            onSuccessCallback(data)
            queryClient.invalidateQueries({ queryKey: [dataKey(variable.doctype)] });
        },
        onError: (error) => {
            showError(error)
        },
    });
};

export const useDeleteData = (onCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params) => {
            return deleteData({ doctype: params.doctype, ids: params.ids })
        },
        onSuccess: (data, variable) => {
            onCallback({ success: true })
            if (data) showMessage(`${variable.doctype} deleted successfully`);
            queryClient.invalidateQueries({ queryKey: [dataKey(variable.doctype)] });
        },
        onError: (error, variable) => {
            onCallback({ error: true })
            showMessage(`Cann't delete ${variable.doctype}, because it is linked`, 'error');
        },
    });
};