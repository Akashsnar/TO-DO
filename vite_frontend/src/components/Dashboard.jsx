import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";


const Dashboard = () => {
  // const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState([]);
  const { isLogin, token } = useSelector((state) => state.user);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/task/task-summary`, {
        headers: {
          'authorization': `Bearer ${token}`,
          'X-Custom-Header': 'value',

        }
      });
      console.log(response);
      
      setSummary(response.data.pendingTaskSummary);
      setStats(response.data.stats)
    } catch (error) {
      console.error("Error fetching task summary:", error);
    }
  };

  useEffect(() => {
    fetchSummary();

  }, []);


  const calculateStats = (tasks) => {
    const now = new Date();

    let completedCount = 0;
    let pendingCount = 0;
    let totalTimeCompleted = 0;
    let totalTimeLapsed = 0;
    let totalBalanceEstimatedTime = 0;

    tasks.forEach((task) => {
      const startTime = new Date(task.starttime);
      const endTime = new Date(task.endtime);

      if (task.task_status) {
        completedCount++;
        totalTimeCompleted += endTime - startTime;
      } else {
        pendingCount++;

        if (now > startTime) {
          totalTimeLapsed += now - startTime;
        }

        if (now < endTime) {
          totalBalanceEstimatedTime += endTime - now;
        }
      }
    });

    const avgTimePerTask =
      tasks.length > 0 ? totalTimeCompleted / tasks.length / (1000 * 60 * 60) : 0;

    setStats({
      totalTasks: tasks.length,
      completedCount,
      pendingCount,
      avgTimePerTask: avgTimePerTask.toFixed(2), 
      totalTimeCompleted: (totalTimeCompleted / (1000 * 60 * 60)).toFixed(2), 
      totalTimeLapsed: (totalTimeLapsed / (1000 * 60 * 60)).toFixed(2), 
      balanceEstimatedTime: (totalBalanceEstimatedTime / (1000 * 60 * 60)).toFixed(2), 
    });
  };


  if (!stats) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        {stats ?
          <div>

            <section className="grid grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{stats.totalTasks}</p>
                <p className="text-gray-600">Total tasks</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">
                  {(stats.completedCount/stats.totalTasks)*100}%
                </p>
                <p className="text-gray-600">Tasks completed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">
                  {(stats.pendingCount/stats.totalTasks)*100}%
                </p>
                <p className="text-gray-600">Tasks pending</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">
                  {stats.avgTimePerTask} hrs
                </p>
                <p className="text-gray-600">Avg. time per task</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Pending task summary
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">{stats.pendingCount}</p>
                  <p className="text-gray-600">Pending tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">
                    {stats.totalTimeLapsed} hrs
                  </p>
                  <p className="text-gray-600">Total time lapsed</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">
                    {stats.balanceEstimatedTime} hrs
                  </p>
                  <p className="text-gray-600">
                    Total time to finish <br />
                    <span className="text-sm text-gray-500">(estimated)</span>
                  </p>
                </div>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Task priority</th>
                    <th className="border border-gray-300 px-4 py-2">Pending tasks</th>
                    <th className="border border-gray-300 px-4 py-2">Time lapsed (hrs)</th>
                    <th className="border border-gray-300 px-4 py-2">Time to finish (hrs)</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((row, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">{row.priority}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.pendingTasks}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.timeLapsed.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.timeToFinish}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
          : ""}
      </main>
    </div>
  );
};

export default Dashboard;
