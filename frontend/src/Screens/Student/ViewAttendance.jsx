import React, { useEffect, useState } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";

const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        toast.loading("Loading attendance...");
        const response = await axiosWrapper.get("/attendance/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setAttendanceData(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to load attendance");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching attendance");
      } finally {
        setLoading(false);
        toast.dismiss();
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Attendance</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : attendanceData.length === 0 ? (
        <p className="text-center text-gray-600">No attendance records found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {attendanceData.map((subject, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow border border-gray-200"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {subject.subjectName} ({subject.subjectCode})
                </h2>
                <p><strong>Present:</strong> {subject.present}</p>
                <p><strong>Total Classes:</strong> {subject.total}</p>
                <p><strong>Attendance %:</strong>{" "}
                  {((subject.present / subject.total) * 100).toFixed(2)}%</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-4">All Records</h2>
          <table className="w-full bg-white shadow rounded overflow-hidden text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((subject) =>
                subject.records.map((record, index) => (
                  <tr key={`${subject.subjectCode}-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{subject.subjectName}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === "present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status === "present" ? "Present" : "Absent"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ViewAttendance;
