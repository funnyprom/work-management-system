import { useState, useEffect } from 'react';
import { PurchaseRequest as PR, PRItem } from '../types';
import { Plus, Trash2, Save, FileText, Eye } from 'lucide-react';

const PurchaseRequest = () => {
  const [prs, setPrs] = useState<PR[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewingPR, setViewingPR] = useState<PR | null>(null);
  const [formData, setFormData] = useState({
    requestor: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [items, setItems] = useState<PRItem[]>([{
    id: '1',
    itemName: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  }]);

  useEffect(() => {
    const storedPRs = localStorage.getItem('purchaseRequests');
    if (storedPRs) {
      setPrs(JSON.parse(storedPRs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('purchaseRequests', JSON.stringify(prs));
  }, [prs]);

  const handleAddItem = () => {
    const newItem: PRItem = {
      id: Date.now().toString(),
      itemName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof PRItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSubmit = (status: PR['status']) => {
    const newPR: PR = {
      id: Date.now().toString(),
      requestNumber: `PR-${Date.now().toString().slice(-6)}`,
      ...formData,
      items: items,
      totalAmount: calculateTotal(),
      status: status,
      createdAt: new Date().toISOString(),
    };

    setPrs([...prs, newPR]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      requestor: '',
      department: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setItems([{
      id: '1',
      itemName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    }]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบ PR นี้หรือไม่?')) {
      setPrs(prs.filter(pr => pr.id !== id));
    }
  };

  const getStatusColor = (status: PR['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: PR['status']) => {
    switch (status) {
      case 'approved': return 'อนุมัติแล้ว';
      case 'pending': return 'รออนุมัติ';
      case 'rejected': return 'ไม่อนุมัติ';
      default: return 'แบบร่าง';
    }
  };

  if (viewingPR) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">รายละเอียด PR</h1>
          <button
            onClick={() => setViewingPR(null)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            กลับ
          </button>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">เลขที่ PR</p>
              <p className="text-lg font-semibold">{viewingPR.requestNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">สถานะ</p>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${getStatusColor(viewingPR.status)}`}>
                {getStatusText(viewingPR.status)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">ผู้ขอ</p>
              <p className="text-lg">{viewingPR.requestor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">แผนก</p>
              <p className="text-lg">{viewingPR.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">วันที่</p>
              <p className="text-lg">{new Date(viewingPR.date).toLocaleDateString('th-TH')}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">รายการสินค้า</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ชื่อสินค้า</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">รายละเอียด</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">จำนวน</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">ราคา/หน่วย</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">รวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {viewingPR.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm">{item.itemName}</td>
                      <td className="px-4 py-3 text-sm">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right">{item.unitPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">{item.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-right font-semibold">ยอดรวมทั้งหมด</td>
                    <td className="px-4 py-3 text-right font-bold text-lg text-primary-600">
                      ฿{viewingPR.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {viewingPR.notes && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-2">หมายเหตุ</h3>
              <p className="text-gray-700">{viewingPR.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">สร้าง Purchase Request</h1>
            <p className="mt-2 text-sm text-gray-600">กรอกข้อมูลเพื่อสร้าง PR ใหม่</p>
          </div>
          <button
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ผู้ขอ *
              </label>
              <input
                type="text"
                required
                value={formData.requestor}
                onChange={(e) => setFormData({ ...formData, requestor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                แผนก *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่ *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">รายการสินค้า</h3>
              <button
                onClick={handleAddItem}
                className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                เพิ่มรายการ
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">รายการที่ {index + 1}</h4>
                    {items.length > 1 && (
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อสินค้า *
                      </label>
                      <input
                        type="text"
                        required
                        value={item.itemName}
                        onChange={(e) => handleItemChange(item.id, 'itemName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        รายละเอียด
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        จำนวน *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ราคา/หน่วย *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="md:col-span-2 bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">ราคารวม</p>
                      <p className="text-xl font-bold text-primary-600">
                        ฿{item.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">ยอดรวมทั้งหมด</span>
                <span className="text-2xl font-bold text-primary-600">
                  ฿{calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมายเหตุ
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
            />
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => handleSubmit('draft')}
              className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              บันทึกร่าง
            </button>
            <button
              onClick={() => handleSubmit('pending')}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              ส่ง PR
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Request</h1>
          <p className="mt-2 text-sm text-gray-600">จัดการและติดตาม PR ทั้งหมด</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          สร้าง PR ใหม่
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {prs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            ยังไม่มี PR ในระบบ กรุณาสร้าง PR ใหม่
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เลขที่ PR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้ขอ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">แผนก</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ยอดรวม</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {prs.map((pr) => (
                  <tr key={pr.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pr.requestNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {pr.requestor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {pr.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(pr.date).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      ฿{pr.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 text-xs font-medium rounded ${getStatusColor(pr.status)}`}>
                        {getStatusText(pr.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => setViewingPR(pr)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pr.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseRequest;

