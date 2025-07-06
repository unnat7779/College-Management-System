import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";

const Subject = () => {
  const [data, setData] = useState({
    name: "",
    code: "",
    branchId: "",
    facultyId: "",
    semester: "",
    credits: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    getSubjectHandler();
    getBranchHandler();
    getFacultyHandler();
  }, []);

  const getSubjectHandler = async () => {
    try {
      toast.loading("Loading subjects...");
      const response = await axiosWrapper.get(`/subject`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setSubjects(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching subjects");
    } finally {
      toast.dismiss();
    }
  };

  const getBranchHandler = async () => {
    try {
      toast.loading("Loading branches...");
      const response = await axiosWrapper.get(`/branch`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setBranches(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching branches");
    } finally {
      toast.dismiss();
    }
  };

  const getFacultyHandler = async () => {
    try {
      toast.loading("Loading faculties...");
      const response = await axiosWrapper.get(`/faculty`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setFaculties(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching faculties");
    } finally {
      toast.dismiss();
    }
  };

  const addSubjectHandler = async () => {
    try {
      toast.loading(isEditing ? "Updating Subject" : "Adding Subject");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };
      const payload = {
        name: data.name,
        code: data.code,
        branchId: data.branch,
        facultyId: data.facultyId,
        semester: data.semester,
        credits: data.credits,
      };
      const response = isEditing
        ? await axiosWrapper.patch(`/subject/${selectedSubjectId}`, payload, { headers })
        : await axiosWrapper.post(`/subject`, payload, { headers });

      if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: "", code: "", branchId: "", facultyId: "", semester: "", credits: "" });
        setShowAddForm(false);
        setIsEditing(false);
        setSelectedSubjectId(null);
        getSubjectHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      toast.dismiss();
    }
  };

  const deleteSubjectHandler = async (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedSubjectId(id);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Subject");
      const response = await axiosWrapper.delete(`/subject/${selectedSubjectId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        toast.success("Subject deleted successfully");
        setIsDeleteConfirmOpen(false);
        getSubjectHandler();
      } else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting subject");
    } finally {
      toast.dismiss();
    }
  };

  const editSubjectHandler = (subject) => {
    setData({
      name: subject.name,
      code: subject.code,
      branchId: subject.branchId?._id,
      facultyId: subject.facultyId?._id,
      semester: subject.semester,
      credits: subject.credits,
    });
    setSelectedSubjectId(subject._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 relative">
      <div className="flex justify-between items-center w-full">
        <Heading title="Subject Details" />
        <CustomButton
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) {
              setData({ name: "", code: "", branchId: "", facultyId: "", semester: "", credits: "" });
              setIsEditing(false);
              setSelectedSubjectId(null);
            }
          }}
        >
          {showAddForm ? <IoMdClose className="text-3xl" /> : <IoMdAdd className="text-3xl" />}
        </CustomButton>
      </div>

      {showAddForm && (
        <div className="flex flex-col justify-center items-center w-full mt-8">
          <div className="w-[40%]">
            <label htmlFor="name" className="leading-7 text-sm">Subject Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full bg-blue-50 rounded border py-1 px-3"
            />
          </div>

          <div className="w-[40%] mt-4">
            <label htmlFor="code" className="leading-7 text-sm">Subject Code</label>
            <input
              type="text"
              value={data.code}
              onChange={(e) => setData({ ...data, code: e.target.value })}
              className="w-full bg-blue-50 rounded border py-1 px-3"
            />
          </div>



          <div className="w-[40%] mt-4">
            <label className="leading-7 text-sm">Select Branch</label>
            <select
              value={data.branchId}
              onChange={(e) => setData({ ...data, branchId: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select Branch</option>
              {branches.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>




          <div className="w-[40%] mt-4">
          <label htmlFor="facultyId" className="leading-7 text-sm">
            Select Faculty
          </label>
          <select
            name="facultyId"
            value={data.facultyId}
            onChange={(e) => setData({ ...data, facultyId: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Faculty</option>
            {faculties.map((fac) => (
              <option key={fac._id} value={fac._id}>
                {fac.firstName} {fac.lastName}
              </option>
            ))}
          </select>
        </div>


          <div className="w-[40%] mt-4">
            <label className="leading-7 text-sm">Semester</label>
            <select
              value={data.semester}
              onChange={(e) => setData({ ...data, semester: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select Semester</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{`${i + 1} Semester`}</option>
              ))}
            </select>
          </div>

          <div className="w-[40%] mt-4">
            <label className="leading-7 text-sm">Credits</label>
            <input
              type="number"
              value={data.credits}
              onChange={(e) => setData({ ...data, credits: e.target.value })}
              className="w-full bg-blue-50 rounded border py-1 px-3"
            />
          </div>

          <CustomButton variant="primary" className="mt-6" onClick={addSubjectHandler}>
            {isEditing ? "Edit Subject" : "Add Subject"}
          </CustomButton>
        </div>
      )}

      {!showAddForm && (
        <div className="mt-8 w-full">
          {subjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No subjects found</div>
          ) : (
            <table className="text-sm min-w-full bg-white">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Code</th>
                  <th className="py-4 px-6">Branch</th>
                  <th className="py-4 px-6">Faculty</th>
                  <th className="py-4 px-6">Semester</th>
                  <th className="py-4 px-6">Credits</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-blue-50">
                    <td className="py-4 px-6">{item.name}</td>
                    <td className="py-4 px-6">{item.code}</td>
                    <td className="py-4 px-6">{item.branchId?.name}</td>
                    <td className="py-4 px-6">  {item.facultyId ? `${item.facultyId.firstName} ${item.facultyId.lastName}` : "N/A"}</td>
                    <td className="py-4 px-6">{item.semester}</td>
                    <td className="py-4 px-6">{item.credits}</td>
                    <td className="py-4 px-6 text-center flex justify-center gap-4">
                      <CustomButton variant="secondary" onClick={() => editSubjectHandler(item)}>
                        <MdEdit />
                      </CustomButton>
                      <CustomButton variant="danger" onClick={() => deleteSubjectHandler(item._id)}>
                        <MdOutlineDelete />
                      </CustomButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this subject?"
      />
    </div>
  );
};

export default Subject;
