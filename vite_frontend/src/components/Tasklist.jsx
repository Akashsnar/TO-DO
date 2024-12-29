import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useSelector } from "react-redux";


Modal.setAppElement("#root");

function TaskList() {
    const { isLogin, token } = useSelector((state) => state.user);

    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({ priority: "", status: "" });
    const [sort, setSort] = useState("");
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({

        title: "",
        priority: 1,
        starttime: "",
        endtime: "",
        task_status: false,
    });

    useEffect(() => {
        fetchTasks();
    }, [filters, sort]);

    const fetchTasks = async () => {
        try {
            console.log("Token in fetchTasks:", token);

            const response = await axios.get(
                `https://to-do-rcm0.onrender.com/task/tasks`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    params: {
                        priority: filters.priority || undefined,
                        task_status:
                            filters.status === "Finished"
                                ? true
                                : filters.status === "Pending"
                                    ? false
                                    : undefined,
                        sortBy: sort || undefined,
                    },
                }
            );
            console.log("API Response:", response.data);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        }
    };

    const addTask = async () => {

        try {
            console.log("add task");
            console.log("Task being sent:", newTask);
            await axios.post(
                `https://to-do-rcm0.onrender.com/task/tasks`,
                newTask,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchTasks();
            closeModal();
        } catch (error) {
            console.error("Error adding task", error);
        }
    };

    const deleteTasks = async () => {
        try {
            for (const taskId of selectedTasks) {
                await axios.delete(
                    `https://to-do-rcm0.onrender.com/tasks/task/${taskId}`,
                    {
                        headers: {
                            authorization: token,
                        },
                    }
                );
            }
            fetchTasks();
            setSelectedTasks([]);
        } catch (error) {
            console.error("Error deleting tasks", error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleSortChange = (value) => {
        setSort(value);
    };

    const toggleSelectTask = (taskId) => {
        setSelectedTasks((prev) =>
            prev.includes(taskId)
                ? prev.filter((id) => id !== taskId)
                : [...prev, taskId]
        );
    };

    return (
        <div className="container">
            <header>
                <h1>Task List</h1>
                <div className="flex justify-between items-center">
                    {/* Left Section: Buttons */}
                    <div className="flex gap-4">
                        <button
                            className="bg-transparent border border-blue-900 text-blue-900 px-4 py-2 rounded hover:bg-blue-100"
                            onClick={openModal}
                        >
                            + Add task
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                            onClick={deleteTasks}
                            disabled={selectedTasks.length === 0}
                        >
                            Delete selected
                        </button>
                    </div>

                    {/* Right Section: Filters */}
                    <div className="flex gap-4">
                        <select
                            className="border border-gray-300 rounded px-4 py-2 bg-white focus:ring focus:ring-blue-300"
                            onChange={(e) => handleFilterChange("priority", e.target.value)}
                        >
                            <option value="">Priority</option>
                            {[1, 2, 3, 4, 5].map((priority) => (
                                <option key={priority} value={priority}>
                                    {priority}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border border-gray-300 rounded px-4 py-2 bg-white focus:ring focus:ring-blue-300"
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                        >
                            <option value="">Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Finished">Finished</option>
                        </select>
                        <select
                            className="border border-gray-300 rounded px-4 py-2 bg-white focus:ring focus:ring-blue-300"
                            onChange={(e) => handleSortChange(e.target.value)}
                        >
                            <option value="">Sort</option>
                            <option value="starttime">Start time: ASC</option>
                            <option value="-starttime">Start time: DESC</option>
                            <option value="endtime">End time: ASC</option>
                            <option value="-endtime">End time: DESC</option>
                        </select>
                    </div>
                </div>

            </header>
            <table className="w-full border-collapse table-auto text-sm text-left border border-gray-300">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Select</th>
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">Title</th>
                        <th className="border border-gray-300 px-4 py-2">Priority</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">Start Time</th>
                        <th className="border border-gray-300 px-4 py-2">End Time</th>
                        <th className="border border-gray-300 px-4 py-2">Duration (hrs)</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task._id} className="border-b last:border-none">
                            <td className="border px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={selectedTasks.includes(task._id)}
                                    onChange={() => toggleSelectTask(task._id)}
                                />
                            </td>
                            <td className="border px-4 py-2">{task._id}</td>
                            <td className="border px-4 py-2">{task.title}</td>
                            <td className="border px-4 py-2">{task.priority}</td>
                            <td className="border px-4 py-2">
                                {task.task_status ? "Finished" : "Pending"}
                            </td>
                            <td className="border px-4 py-2">
                                {new Date(task.starttime).toLocaleString()}
                            </td>
                            <td className="border px-4 py-2">
                                {new Date(task.endtime).toLocaleString()}
                            </td>
                            <td className="border px-4 py-2">
                                {(
                                    (new Date(task.endtime) - new Date(task.starttime)) /
                                    (1000 * 60 * 60)
                                ).toFixed(2)}
                            </td>
                            <td className="border px-4 py-2 text-center">
                                <button className="text-white font-bold py-1 px-2 rounded">
                                    ✏️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Task Modal */}
            {/* <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <h2>Add New Task</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addTask();
                    }}
                >
                    <label>
                        Title:
                        <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) =>
                                setNewTask((prev) => ({ ...prev, title: e.target.value }))
                            }
                            required
                        />
                    </label>
                    <label>
                        Priority:
                        <select
                            value={newTask.priority}
                            onChange={(e) =>
                                setNewTask((prev) => ({
                                    ...prev,
                                    priority: parseInt(e.target.value),
                                }))
                            }
                        >
                            {[1, 2, 3, 4, 5].map((priority) => (
                                <option key={priority} value={priority}>
                                    {priority}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Start Time:
                        <input
                            type="datetime-local"
                            value={newTask.starttime}
                            onChange={(e) =>
                                setNewTask((prev) => ({
                                    ...prev,
                                    starttime: e.target.value,
                                }))
                            }
                        />
                    </label>
                    <label>
                        End Time:
                        <input
                            type="datetime-local"
                            value={newTask.endtime}
                            onChange={(e) =>
                                setNewTask((prev) => ({
                                    ...prev,
                                    endtime: e.target.value,
                                }))
                            }
                        />
                    </label>
                    <label>
                        Status:
                        <select
                            value={newTask.task_status}
                            onChange={(e) =>
                                setNewTask((prev) => ({
                                    ...prev,
                                    task_status: e.target.value === "true",
                                }))
                            }
                        >
                            <option value={false}>Pending</option>
                            <option value={true}>Finished</option>
                        </select>
                    </label>
                    <button type="submit" className="btn btn-primary">
                        Add task
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </form>
            </Modal> */}


            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Add New Task</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addTask();
                    }}
                    className="space-y-4"
                >
                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Title:</label>
                        <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) =>
                                setNewTask((prev) => ({ ...prev, title: e.target.value }))
                            }
                            required
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    {/* Priority Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Priority:</label>
                        <select
                            value={newTask.priority}
                            onChange={(e) =>
                                setNewTask((prev) => ({
                                    ...prev,
                                    priority: parseInt(e.target.value),
                                }))
                            }
                            className="w-full border border-gray-300 rounded-md p-2"
                        >
                            {[1, 2, 3, 4, 5].map((priority) => (
                                <option key={priority} value={priority}>
                                    {priority}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Time Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Time:</label>
                        <input
                            type="datetime-local"
                            value={newTask.starttime}
                            onChange={(e) =>
                                setNewTask((prev) => ({
                                    ...prev,
                                    starttime: e.target.value,
                                }))
                            }
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    {/* End Time Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1">End Time:</label>
                        <input
                            type="datetime-local"
                            value={newTask.endtime}
                            onChange={(e) =>
                                setNewTask((prev) => ({
                                    ...prev,
                                    endtime: e.target.value,
                                }))
                            }
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    {/* Status Toggle
        <div>
          <label className="block text-sm font-medium mb-1">Status:</label>
          <div className="flex items-center space-x-4 mt-1">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="status"
                value={false}
                checked={!newTask.task_status}
                onChange={() =>
                  setNewTask((prev) => ({ ...prev, task_status: false }))
                }
                className="form-radio text-blue-500"
              />
              <span>Pending</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="status"
                value={true}
                checked={newTask.task_status}
                onChange={() =>
                  setNewTask((prev) => ({ ...prev, task_status: true }))
                }
                className="form-radio text-blue-500"
              />
              <span>Finished</span>
            </label>
          </div>
        </div> */}

                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer" />
                        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span class="ms-3 text-sm font-medium text-gray-900 " onChange={()=>{setNewTask((prev) => ({ ...prev, task_status: !task_status }))}}>Finished</span>
                    </label>



                    <div className="flex justify-between mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Add Task
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default TaskList;
