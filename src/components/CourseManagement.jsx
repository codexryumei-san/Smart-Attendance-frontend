import { useState } from "react";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]); // Blank slate
  const [formData, setFormData] = useState({ code: "", name: "", programme: "", level: "" });
  const [isEditing, setIsEditing] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setCourses(courses.map(c => c.id === isEditing ? { ...c, ...formData } : c));
      setIsEditing(null);
    } else {
      setCourses([...courses, { id: Date.now(), ...formData }]);
    }
    setFormData({ code: "", name: "", programme: "", level: "" });
  };

  const handleDelete = (id) => setCourses(courses.filter(c => c.id !== id));

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Course" : "Create New Course"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Course Code</label>
            <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full border rounded-lg px-4 py-2" placeholder="e.g. IT401" />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Course Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-4 py-2" placeholder="e.g. Multimedia Systems" />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Programme</label>
            <select required value={formData.programme} onChange={e => setFormData({...formData, programme: e.target.value})} className="w-full border rounded-lg px-4 py-2 bg-white">
              <option value="" disabled>Select Programme</option>
              <option value="BSc Information Technology">BSc Information Technology</option>
              <option value="BSc Computer Science">BSc Computer Science</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Level</label>
            <select required value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full border rounded-lg px-4 py-2 bg-white">
              <option value="" disabled>Select Level</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3 mt-2">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700">
              {isEditing ? "Update Course" : "Add Course"}
            </button>
            {isEditing && (
              <button type="button" onClick={() => {setIsEditing(null); setFormData({code: "", name: "", programme: "", level: ""})}} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-bold">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b">
              <th className="p-4 font-bold">Code & Name</th>
              <th className="p-4 font-bold">Programme</th>
              <th className="p-4 font-bold">Level</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500 font-medium">No courses registered yet.</td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-semibold text-indigo-700">{course.code} <span className="text-slate-600 font-medium ml-2">{course.name}</span></td>
                  <td className="p-4">{course.programme}</td>
                  <td className="p-4">Level {course.level}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => {setFormData(course); setIsEditing(course.id);}} className="text-blue-600 font-bold hover:underline">Edit</button>
                    <span className="text-slate-300">|</span>
                    <button onClick={() => handleDelete(course.id)} className="text-red-600 font-bold hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}