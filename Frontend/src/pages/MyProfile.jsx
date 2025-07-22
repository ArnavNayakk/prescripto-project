import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

function MyProfile() {
  const { userData, setUserData, token, backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Sync formData with userData
  useEffect(() => {
    if (userData) {
      setFormData({ ...userData });
      setImage(null);
      setPreviewUrl(null);
    }
  }, [userData]);

  // Handle image preview
  useEffect(() => {
    if (image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const updateUserProfileData = async () => {
    if (!formData) return;

    try {
      const payload = new FormData();
      payload.append('userId', formData._id); 
      payload.append('name', formData.name);
      payload.append('phone', formData.phone);
      payload.append('address', JSON.stringify(formData.address || {}));
      payload.append('gender', formData.gender);
      payload.append('dob', formData.dob);
      if (image instanceof File) {
        payload.append('image', image);
      }

      // Optional: debug log
      for (let [key, value] of payload.entries()) {
        console.log(`${key}:`, value);
      }

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        if (data.userData) {
          setUserData(data.userData);
          setFormData(data.userData);
        }
        setIsEdit(false);
        setImage(null);
        setPreviewUrl(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  if (!formData) return null;

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-36 rounded opacity-75"
              src={previewUrl || formData.image}
              onError={(e) => (e.target.src = assets.default_profile)}
              alt="Profile"
            />
            {!image && (
              <img
                className="w-10 absolute bottom-12 right-12"
                src={assets.upload_icon}
                alt="Upload"
              />
            )}
          </div>
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
      ) : (
        <img
          className="w-36 rounded"
          src={formData.image}
          onError={(e) => (e.target.src = assets.default_profile)}
          alt="Profile"
        />
      )}

      {isEdit ? (
        <input
          className="bg-gray-100 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">{formData.name}</p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-500">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{formData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={formData.phone || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <p className="text-blue-500">{formData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <>
              <input
                className="bg-gray-100"
                type="text"
                placeholder="Line 1"
                value={formData.address?.line1 || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...(prev.address || {}), line1: e.target.value },
                  }))
                }
              />
              <br />
              <input
                className="bg-gray-100 mt-2"
                type="text"
                placeholder="Line 2"
                value={formData.address?.line2 || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...(prev.address || {}), line2: e.target.value },
                  }))
                }
              />
            </>
          ) : (
            <p className="text-gray-500">
              {formData.address?.line1}
              <br />
              {formData.address?.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              value={formData.gender || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{formData.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              value={formData.dob || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, dob: e.target.value }))}
            />
          ) : (
            <p className="text-gray-400">{formData.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        {isEdit ? (
          <>
            <button
              className="border border-[#5f6fff] px-8 py-2 rounded-full hover:text-white hover:bg-[#5f6fff] transition-all duration-300"
              onClick={updateUserProfileData}
            >
              Save information
            </button>
            <button
              className="border border-[#5f6fff] px-8 py-2 rounded-full hover:bg-[#5f6fff] transition-all duration-300"
              onClick={() => {
                setIsEdit(false);
                setFormData({ ...userData }); 
                setImage(null);
                setPreviewUrl(null);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="border border-[#5f6fff] px-8 py-2 rounded-full hover:text-white hover:bg-[#5f6fff] transition-all duration-300"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default MyProfile;


