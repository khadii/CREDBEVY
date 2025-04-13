"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CollateralSelection from "../FormInputs/CollateralSelection";
import InputField from "../FormInputs/iputDetails";
import { useDashboard } from "@/app/Context/DahboardContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/Redux/store";
import {
  get_single_user,
  list_of_users,
  Update_user,
} from "@/app/Redux/user_management/user_mananagement_thunk";
import AnimatedLoader from "../animation";
import toast from "react-hot-toast";
import { resetUserState } from "@/app/Redux/user_management/Update_user_slice";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
}

interface Role {
  id: number;
  name: string;
  pivot: {
    role_id: number;
  };
}

interface UserData {
  uuid: string;
  first_name: string;
  last_name: string;
  user_name: string | null;
  email: string;
  phone_number: string;
  deactivated: number;
  roles: Role[];
}

interface FormValues {
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  roleId: number;
  isActive: boolean;
  user_id: string;
}

const ROLE_OPTIONS = [
  { label: "Super Admin", id: 1 },
  { label: "Editor", id: 2 },
  { label: "Viewer", id: 3 },
];

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  userName: Yup.string().required("User Name is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().optional(),
  roleId: Yup.number().required("Role is required"),
  isActive: Yup.boolean().required("Active status is required"),
});

const getDefaultSelectedRoles = (roles?: Role[]): string[] => {
  if (!roles || !roles.length) return [];
  return roles[0].name ? [roles[0].name] : [];
};

const getRoleIdFromName = (roleName: string): number => {
  const role = ROLE_OPTIONS.find((r) => r.label === roleName);
  return role ? role.id : 0;
};

const EditUserModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  currentPage,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIds, setSelectedIds } = useDashboard();

  const {
    userData: data,
    loading,
    error,
    success,
  } = useSelector((state: any) => state.updateUsers);
  const {
    user: userData,
    loading: userloading,
    error: usererror,
    success: usersuccess,
  } = useSelector((state: any) => state.singleUser);

  useEffect(() => {
    if (isOpen && selectedIds) {
      dispatch(get_single_user({ user_id: selectedIds }));
    }
  }, [dispatch, selectedIds, isOpen]);

  const user_management = {
    search: "",
    role: "",
    page: currentPage,
  };

  useEffect(() => {
    if (success) {
      dispatch(list_of_users({ ...user_management }));
      toast.success(data.message);
      dispatch(resetUserState());
      onClose();
    }

    if (error) {
      toast.error(error);
      dispatch(resetUserState());
    }
  }, [dispatch, error, success]);

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      phoneNumber: "",
      email: "",
      password: "",
      roleId: 0,
      isActive: true,
      user_id: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const userDetails = {
          first_name: values.firstName,
          last_name: values.lastName,
          user_name: values.userName,
          phone_number: values.phoneNumber,
          email: values.email,
          password: values.password || undefined,
          role_id: values.roleId,
          deactivated: values.isActive ? 0 : 1,
          user_id: values.user_id,
        };

        await dispatch(Update_user(userDetails)).unwrap();
      } catch (error) {
        console.error("Update failed:", error);
      }
    },
  });

  useEffect(() => {
    if (userData) {
      formik.setValues({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        userName: userData.user_name || "",
        phoneNumber: userData.phone_number || "",
        email: userData.email || "",
        password: "",
        roleId: userData.roles?.[0]?.pivot?.role_id,
        isActive: userData.deactivated === 0,
        user_id: userData.uuid || "",
      });
    }
  }, [userData]);

  if (!isOpen) return null;

  const availableOptions = ROLE_OPTIONS.map((role) => role.label);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#17191CBA]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-modal-title"
    >
      <div className="relative bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex pl-6 pt-6 pr-4 justify-between w-full items-center border-b pb-4">
          <h2 className="text-2xl font-semibold text-[#333333]">Edit User</h2>
          <button
            onClick={onClose}
            className="text-[#333333] px-2 rounded-[4px] border font-bold text-xs"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InputField
                  label="First Name"
                  placeholder="Enter First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange("firstName")}
                  error={formik.touched.firstName && formik.errors.firstName}
                  required
                />
              </div>

              <div>
                <InputField
                  label="Last Name"
                  placeholder="Enter Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange("lastName")}
                  error={formik.touched.lastName && formik.errors.lastName}
                  required
                />
              </div>

              <div>
                <InputField
                  label="User Name"
                  placeholder="Enter User Name"
                  value={formik.values.userName}
                  onChange={formik.handleChange("userName")}
                  error={formik.touched.userName && formik.errors.userName}
                  required
                />
              </div>

              <div>
                <InputField
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange("phoneNumber")}
                  error={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                  required
                />
              </div>

              <div>
                <InputField
                  label="Email"
                  placeholder="Enter Email"
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  error={formik.touched.email && formik.errors.email}
                  required
                />
              </div>

              <div>
                <InputField
                  label="Password"
                  placeholder="Enter Password"
                  value={formik.values.password}
                  onChange={formik.handleChange("password")}
                  error={formik.touched.password && formik.errors.password}
                  type="password"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <CollateralSelection
                  key={userData?.uuid} // force re-render when userData changes
                  label="User's roles"
                  availableOptions={availableOptions}
                  defaultSelectedOptions={getDefaultSelectedRoles(
                    userData?.roles
                  )}
                  onChange={(selectedOptions) =>
                    formik.setFieldValue(
                      "roleId",
                      getRoleIdFromName(selectedOptions[0])
                    )
                  }
                  error={formik.touched.roleId && formik.errors.roleId}
                  required
                  visibility="block"
                />

                <p className="font-medium text-xs text-[#666687]">
                  A user can have one or several roles
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">
                  Active
                </label>
                <div className="flex w-full max-w-[193px] h-10 bg-[#DCDCE4] justify-between items-center px-1 border rounded-[4px]">
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("isActive", false)}
                    className={`px-4 py-1 text-xs font-bold rounded-[4px] ${
                      !formik.values.isActive
                        ? "bg-white text-[#007D69] w-[92px] h-8"
                        : "bg-[#DCDCE4] text-[#8A8B9F]"
                    }`}
                    aria-pressed={!formik.values.isActive}
                  >
                    FALSE
                  </button>
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("isActive", true)}
                    className={`px-4 py-1 text-xs font-bold rounded-[4px] ${
                      formik.values.isActive
                        ? "bg-white text-[#007D69] w-[92px] h-8"
                        : "bg-[#DCDCE4] text-[#8A8B9F]"
                    }`}
                    aria-pressed={formik.values.isActive}
                  >
                    TRUE
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between w-full mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-[81px] py-[10px] border border-[#333333] rounded-[4px] text-xs font-bold text-[#333333] hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-[81px] py-[10px] border border-[#156064] bg-[#156064] rounded-[4px] text-xs font-bold text-white hover:bg-opacity-90 transition-colors"
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <AnimatedLoader isLoading={userloading || loading} />
    </div>
  );
};

export default EditUserModal;
