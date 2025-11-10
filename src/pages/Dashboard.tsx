import { useEffect, useState } from 'react';
import { Task, PurchaseRequest } from '../types';
import { CheckCircle2, Clock, AlertCircle, FileText, TrendingUp } from 'lucide-react';
import Calendar from '../components/Calendar';
import { tasksApi, purchaseRequestsApi } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [prs, setPrs] = useState<PurchaseRequest[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load tasks and PRs in parallel
      const [tasksData, prsData] = await Promise.all([
        tasksApi.getAll(),
        purchaseRequestsApi.getAll(),
      ]);
      
      setTasks(tasksData);
      setPrs(prsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('ไม่สามารถโหลดข้อมูลได้ กำลังใช้ข้อมูลจาก Local Storage');
      
      // Fallback to localStorage
      const storedTasks = localStorage.getItem('tasks');
      const storedPrs = localStorage.getItem('purchaseRequests');
      
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedPrs) setPrs(JSON.parse(storedPrs));
    } finally {
      setLoading(false);
    }
  };

  const taskStats = {
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    total: tasks.length,
  };

  const prStats = {
    draft: prs.filter(p => p.status === 'draft').length,
    pending: prs.filter(p => p.status === 'pending').length,
    approved: prs.filter(p => p.status === 'approved').length,
    total: prs.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
        <p className="mt-2 text-sm text-gray-600">ภาพรวมของระบบติดตามงาน</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          กำลังโหลดข้อมูล...
        </div>
      )}

      {/* Task Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">สถิติงาน</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">งานทั้งหมด</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">รอดำเนินการ</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{taskStats.todo}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">กำลังดำเนินการ</p>
                <p className="mt-2 text-3xl font-bold text-orange-600">{taskStats.inProgress}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">เสร็จสิ้น</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{taskStats.done}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PR Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">สถิติ Purchase Request</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PR ทั้งหมด</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{prStats.total}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">แบบร่าง</p>
                <p className="mt-2 text-3xl font-bold text-gray-600">{prStats.draft}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">รออนุมัติ</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{prStats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">อนุมัติแล้ว</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{prStats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ปฏิทินงาน</h2>
        <Calendar tasks={tasks} onTaskClick={setSelectedTask} />
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedTask(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedTask.title}</h3>
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">รายละเอียด</p>
                <p className="text-gray-900">{selectedTask.description}</p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">สถานะ</p>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    selectedTask.status === 'done' ? 'bg-green-100 text-green-800' :
                    selectedTask.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedTask.status === 'done' ? 'เสร็จสิ้น' :
                     selectedTask.status === 'in-progress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">ความสำคัญ</p>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    selectedTask.priority === 'high' ? 'bg-red-100 text-red-800' :
                    selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedTask.priority === 'high' ? 'สูง' :
                     selectedTask.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">ผู้รับผิดชอบ</p>
                <p className="text-gray-900">{selectedTask.assignee}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">วันกำหนดส่ง</p>
                <p className="text-gray-900">{new Date(selectedTask.dueDate).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTask(null)}
              className="mt-6 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">งานล่าสุด</h2>
        <div className="bg-white rounded-lg shadow border border-gray-200">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              ยังไม่มีงานในระบบ
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        task.status === 'done' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status === 'done' ? 'เสร็จสิ้น' :
                         task.status === 'in-progress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

