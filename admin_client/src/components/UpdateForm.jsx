import React, { useState } from "react";

const UpdateForm = ({ title, fields, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(initialData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => {
            if (field.type === "select") {
              return (
                <div className="mb-4" key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block font-medium mb-1 capitalize"
                  >
                    {field.label || field.name}
                  </label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="border border-gray-300 rounded w-full p-2"
                  >
                    <option value="" disabled>
                      {field.placeholder || "Select an option"}
                    </option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.type === "textarea") {
              return (
                <div className="mb-4" key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block font-medium mb-1 capitalize"
                  >
                    {field.label || field.name}
                  </label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded w-full p-2"
                    placeholder={field.placeholder || ""}
                  />
                </div>
              );
            }

            return (
              <div className="mb-4" key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block font-medium mb-1 capitalize"
                >
                  {field.label || field.name}
                </label>
                <input
                  type={field.type || "text"}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full p-2"
                  placeholder={field.placeholder || ""}
                  required="true"
                />
              </div>
            );
          })}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm;
