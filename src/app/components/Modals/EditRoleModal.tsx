"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../FormInputs/iputDetails";
import CheckToggleButton from "../FormInputs/CheckToggle";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface Permission {
  resource: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

const EditRoleModal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [permissions, setPermissions] = useState<Permission[]>([
    { resource: "New Role", create: false, read: true, update: true, delete: true },
    { resource: "Analytics", create: true, read: true, update: false, delete: true },
    { resource: "Loan Request", create: false, read: true, update: true, delete: true },
    { resource: "Settings", create: true, read: true, update: true, delete: true },
    { resource: "Loan History", create: false, read: true, update: true, delete: false },
    { resource: "Integrations", create: false, read: true, update: true, delete: true },
    { resource: "Financials", create: false, read: true, update: true, delete: true },
  ]);

  const validationSchema = Yup.object({
    roleName: Yup.string().required("Role Name is required"),
    description: Yup.string().required("Description  is required"),
  });

  const formik = useFormik({
    initialValues: {
      roleName: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onConfirm();
      onClose();
    },
  });

  const togglePermission = (index: number, field: keyof Omit<Permission, 'resource'>) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[index] = {
      ...updatedPermissions[index],
      [field]: !updatedPermissions[index][field]
    };
    setPermissions(updatedPermissions);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#17191CBA]"

    >
      <div className="relative bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-10 flex pl-6 pt-6 pr-4 justify-between w-full items-center border-b pb-4">
          <h2 className="text-2xl font-semibold text-[#333333]" id="edit-role-modal-title">
            Edit Role
          </h2>
          <button
            onClick={onClose}
            className="text-[#333333] px-2 rounded-[4px] border font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={formik.handleSubmit}>
          <div className="p-6">
            {/* Basic Role Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <InputField
                  label="Role Name"
                  placeholder="Enter Role Name"
                  value={formik.values.roleName}
                  onChange={formik.handleChange("roleName")}
                  error={formik.touched.roleName && formik.errors.roleName}
                  required
                />
              </div>
              <div>
                <InputField
                  label="Description"
                  placeholder="Enter Description"
                  value={formik.values.description}
                  onChange={formik.handleChange("description")}
                  error={formik.touched.description && formik.errors.description}
                />
              </div>
            </div>

            {/* Permissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="text-left py-4 font-semibold text-xs text-[#8A8B9F]">ROLES</th>
                    <th className="text-left py-4 font-semibold text-xs text-[#8A8B9F]">CREATE</th>
                    <th className="text-left py-4 font-semibold text-xs text-[#8A8B9F]">READ</th>
                    <th className="text-left py-4 font-semibold text-xs text-[#8A8B9F]">UPDATE</th>
                    <th className="text-left py-4 font-semibold text-xs text-[#8A8B9F]">DELETE</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission, index) => (
                    <tr key={index} className="">
                      <td className="py-4 text-sm font-semibold text-[#333333]">{permission.resource}</td>
                      <td className="py-4 text-center">
                        <CheckToggleButton
                          isActive={permission.create}
                          onClick={() => togglePermission(index, 'create')}
                        />
                      </td>
                      <td className="py-4 text-center">
                        <CheckToggleButton
                          isActive={permission.read}
                          onClick={() => togglePermission(index, 'read')}
                        />
                      </td>
                      <td className="py-4 text-center">
                        <CheckToggleButton
                          isActive={permission.update}
                          onClick={() => togglePermission(index, 'update')}
                        />
                      </td>
                      <td className="py-4 text-center">
                        <CheckToggleButton
                          isActive={permission.delete}
                          onClick={() => togglePermission(index, 'delete')}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Modal Footer */}
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
              >
                Proceed
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoleModal;