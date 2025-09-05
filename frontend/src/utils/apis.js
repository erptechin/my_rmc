import axios from 'axios';
import axiosInstance from "utils/axios";
import { toast } from "sonner";

import { JWT_HOST_API, company } from 'configs/auth.config';

export const getAuthorizationToken = async () => {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const decodedToken = new TextDecoder("utf-8").decode(Uint8Array.from(atob(token), c => c.charCodeAt(0)));
    axiosInstance.defaults.headers['Authorization'] = `token ${decodedToken}`
  }
}

export const showMessage = (data, type = null) => {
  if (type == "error") {
    toast.error(data);
  } else {
    toast.success(data);
  }
};

export const showError = (error) => {
  if (error?.response?.data?.message) {
    return toast.error(error.response.data.message);
  } else if (error?.response?.data?._server_messages || error._server_messages) {
    const server_messages = JSON.parse(error._server_messages ?? error?.response?.data?._server_messages)
    const combinedMessage = server_messages
      .map(item => {
        const message = JSON.parse(item).message;
        return message.replace(/<\/?[^>]+(>|$)/g, "");
      })
      .join(" ");
    return toast.error(combinedMessage);
  } else {
    return toast.error(error?.message);
  }
};

export const signUp = async (body) => {
  body['company'] = company
  const response = await axiosInstance.post(`method/erptech_rcm.api.auth.sign_up`, body);
  return response.data;
};

export const forgotPassword = async (body) => {
  const response = await axiosInstance.post(`method/erptech_rcm.api.auth.forgot_password`, body);
  return response.data;
};

export const resetPassword = async (body) => {
  const response = await axiosInstance.post(`method/erptech_rcm.api.auth.reset_password`, body);
  return response.data;
};

export const loginApi = async (params) => {
  params['company'] = company
  const response = await axiosInstance.get(`method/erptech_rcm.api.auth.login`, { params });
  return response.data;
};

export const fetchProfile = async () => {
  await getAuthorizationToken()
  const response = await axiosInstance.get(`method/erptech_rcm.api.auth.profile`);
  return response.data;
};

export const updProfile = async (body) => {
  await getAuthorizationToken()
  const response = await axiosInstance.post(`method/erptech_rcm.api.auth.update_profile`, body);
  return response.data;
};

export const logOut = async () => {
  const response = await axiosInstance.get(`method/logout`, { withCredentials: false });
  return response.data.message;
};

export const changePassword = async (body) => {
  await getAuthorizationToken()
  const response = await axiosInstance.post(`method/erptech_rcm.api.auth.change_password`, body);
  return response.data;
};

export const getInfo = async (params) => {
  await getAuthorizationToken()
  const response = await axiosInstance.get(`method/erptech_rcm.api.doctype.list_info`, { params });
  return response?.data?.data
};

export const getListData = async (params) => {
  await getAuthorizationToken()
  const response = await axiosInstance.get(`method/erptech_rcm.api.doctype.list_data`, { params });
  return response?.data?.data
};

export const getSingleData = async (params) => {
  await getAuthorizationToken()
  const response = await axiosInstance.get(`method/erptech_rcm.api.doctype.single_data`, { params })
  return response?.data?.data?.data ?? {};
};

export const addData = async (params) => {
  await getAuthorizationToken()
  const response = await axiosInstance.post(`resource/${params.doctype}`, params.body);
  return response.data.data;
};

export const updateData = async (params) => {
  await getAuthorizationToken()
  const response = await axiosInstance.put(`resource/${params.doctype}/${params.body.id}`, params.body);
  return response.data.data;
};

export const deleteData = async (body) => {
  await getAuthorizationToken()
  const response = await axiosInstance.post(`method/erptech_rcm.api.doctype.delete_data`, body);
  return response.data;
};

export const getCustomData = async (params) => {
  await getAuthorizationToken()
  const response = await axiosInstance.post(`method/${params.url}`, params.args)
  if (response?.data?.data) { 
    return response?.data?.data
  } else {
    return response?.data?.message ?? {};
  }
};

// File Upload
export const uploadFile = async (file) => {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const decodedToken = new TextDecoder("utf-8").decode(Uint8Array.from(atob(token), c => c.charCodeAt(0)));
    axios.defaults.headers['Authorization'] = `token ${decodedToken}`
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${JWT_HOST_API}/api/method/upload_file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `token ${decodedToken}`
      },
    });
    return response?.data?.message
  }
};