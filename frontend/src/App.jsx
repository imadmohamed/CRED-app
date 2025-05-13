import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", city: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllNotes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err.message);
    }
  };

  const handleAddNote = async () => {
    if (!form.name || !form.age || !form.city) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const newNote = { ...form }; 
      if (isEditing) {
        await axios.put(`http://localhost:8000/notes/${editId}`, newNote);
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post("http://localhost:8000/notes", newNote);
      }

      setForm({ name: "", age: "", city: "" });
      getAllNotes();
    } catch (err) {
      console.error("Error saving note:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/notes/${id}`);
      getAllNotes();
    } catch (err) {
      console.error("Error deleting note:", err.message);
    }
  };

  const handleEdit = (note) => {
    setForm({ name: note.name, age: note.age, city: note.city });
    setIsEditing(true);
    setEditId(note.id);
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  // Filter notes by search
  const filteredNotes = notes.filter(note =>
    note.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.age.toString().includes(searchTerm) ||
    note.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container'>
      <h3>"Notes" application with React.js frontend & Node.js backend</h3>

      <div className='input-search'>
        <input
          type='text'
          placeholder='Search by title, year, or description'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='input-search'>
        <input
          type='text'
          placeholder='Title'
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type='number'
          placeholder='Year'
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <input
          type='text'
          placeholder='Description'
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <button className="btn blue" onClick={handleAddNote}>
          {isEditing ? "UPDATE NOTE" : "NEW NOTE"}
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>Title</th>
            <th>Year</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotes.map((note, index) => (
            <tr key={note.id}>
              <td>{index + 1}</td>
              <td>{note.name}</td>
              <td>{note.age}</td>
              <td>{note.city}</td>
              <td>{new Date(note.createdAt).toLocaleString()}</td>
              <td>{new Date(note.updatedAt).toLocaleString()}</td>
              <td>
                <button className="btn green" onClick={() => handleEdit(note)}>
                  Edit
                </button>
              </td>
              <td>
                <button className="btn red" onClick={() => handleDelete(note.id)} style={{ fontSize: '24px' }}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

