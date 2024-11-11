import { useState } from 'react';

const CreateJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateJob = (e) => {
    e.preventDefault();
    alert(`Đã tạo tin tuyển dụng: ${title}`);
  };

  return (
    <div className="p-8 mt-10 bg-white">
      <h2 className="text-xl font-bold mb-4">Tạo tin tuyển dụng mới</h2>
      <form onSubmit={handleCreateJob} className="space-y-4">
        <input
          type="text"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        <textarea
          placeholder="Mô tả công việc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-lg"
        ></textarea>
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg">
          Tạo
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
