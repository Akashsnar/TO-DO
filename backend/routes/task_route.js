import express from "express"
import {Task} from '../model/task_model.js'
import { authenticate } from '../middlware/auth.js';

const router = express.Router();


router.post('/tasks', authenticate, async (req, res) => {
    console.log("it called");
    
    try {
        const { title, starttime, endtime, priority , task_status} = req.body;
        console.log(task_status);
        
        const task = new Task({ 
            title, 
            starttime, 
            endtime, 
            priority, 
            task_status,
            user: req.user.id 
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/tasks', authenticate, async (req, res) => {
    try {
        const { priority, task_status, sortBy, page = 1, limit = 10 } = req.query;
        const query = { user: req.user.id };
        if (priority) query.priority = priority;
        if (task_status) query.task_status = task_status === 'true';

        const tasks = await Task.find(query)
            .sort(sortBy ? { [sortBy]: 1 } : {})
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/tasks/:id', authenticate, async (req, res) => {
    try {
        const updates = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            updates,
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/tasks/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// router.get('', async()=>{
//     // const calculateStats = (tasks) => {
//         const tasks = await Task.find(); 
       
// })

router.get('/task-summary', async (req, res) => {
    try {
      const tasks = await Task.find(); 
      const currentTime = new Date();
      const pendingTaskSummary = Array(5).fill(null).map((_, index) => ({
        priority: index + 1,
        pendingTasks: 0,
        timeLapsed: 0,
        timeToFinish: 0,
      }));
      tasks.forEach((task) => {
        if (!task.task_status) { 
          const priority = task.priority || 1;
          const startTime = new Date(task.starttime);
          const endTime = new Date(task.endtime);
  
          const summary = pendingTaskSummary[priority - 1];
  
          summary.pendingTasks++;
          const timeLapsed = currentTime < startTime ? 0 : (currentTime - startTime) / (1000 * 60 * 60);
          summary.timeLapsed += timeLapsed;
          const timeToFinish = currentTime > endTime ? 0 : (endTime - startTime) / (1000 * 60 * 60);
          summary.timeToFinish += timeToFinish;
        }
      });








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

      const avgTimePerTask = tasks.length > 0 ? totalTimeCompleted / tasks.length / (1000 * 60 * 60) : 0;

  


    const stats = {
        totalTasks: tasks.length,
        completedCount,
        pendingCount,
        avgTimePerTask: avgTimePerTask.toFixed(2),
        totalTimeCompleted: (totalTimeCompleted / (1000 * 60 * 60)).toFixed(2),
        totalTimeLapsed: (totalTimeLapsed / (1000 * 60 * 60)).toFixed(2),
        balanceEstimatedTime: (totalBalanceEstimatedTime / (1000 * 60 * 60)).toFixed(2),
      };


      res.json({ pendingTaskSummary, stats });
    } catch (err) {
      console.error("Error fetching task summary:", err);
      res.status(500).json({ error: "Server Error" });
    }
  });
  


export default router;
