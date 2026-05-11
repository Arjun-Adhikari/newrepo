import { useState } from 'react';
import SubjectForm from "./subject/Subject_form";
import TeacherForm from "./teacher/Teacher_form";
import SchoolForm from "./school/School_form";
import StudentForm from "./student/Student_form";

export default function Adddata() {
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <h2 className="bg-slate-800 text-white p-5 m-0 text-center text-xl font-semibold tracking-wide">
          Database Administration Entry
        </h2>

        <div className="flex border-b border-gray-200 bg-gray-50">
          {['student', 'school', 'subject', 'teacher'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 p-4 font-medium text-base transition-all duration-200 capitalize
                ${activeTab === tab 
                  ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'student' && <StudentForm />}
          {activeTab === 'school' && <SchoolForm />}
          {activeTab === 'subject' && <SubjectForm />}
          {activeTab === 'teacher' && <TeacherForm />}
        </div>

      </div>
    </div>
  );
}