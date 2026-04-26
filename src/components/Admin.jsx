import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    types: '',
    size: '',
    price: '',
    description: ''
  });
  const [files, setFiles] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [productsList, setProductsList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      setProductsList(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (password === 'VeRo@26') {
        setIsAuthenticated(true);
        setMessage({ type: '', text: '' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('admin_auth')
        .select('*')
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('كلمة المرور غير صحيحة');
      }

      setIsAuthenticated(true);
      setMessage({ type: '', text: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'كلمة المرور غير صحيحة' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let finalImages = [];

      // 1. Upload files to Storage if there are new files
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          finalImages.push(publicUrlData.publicUrl);
        }
      } else if (editingId) {
        // Keep existing images if editing and no new files uploaded
        const existingProduct = productsList.find(p => p.id === editingId);
        if (existingProduct) {
          finalImages = existingProduct.images || [];
        }
      }

      // Process types string into an array
      const typesArray = formData.types.split(',').map(t => t.trim()).filter(t => t !== '');

      // 2. Insert or Update database
      const productData = {
        name: formData.name,
        types: typesArray,
        size: formData.size,
        price: parseFloat(formData.price),
        description: formData.description,
        images: finalImages
      };

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);
        if (error) throw error;
        setMessage({ type: 'success', text: 'تم تعديل المنتج بنجاح!' });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
        setMessage({ type: 'success', text: 'تم إضافة المنتج بنجاح!' });
      }

      setFormData({ name: '', types: '', size: '', price: '', description: '' });
      setFiles([]);
      setEditingId(null);
      if (document.getElementById('file-upload')) {
        document.getElementById('file-upload').value = '';
      }
      
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error adding/updating product:', error);
      setMessage({ type: 'error', text: 'حدث خطأ. تأكد من إعداد Storage Bucket أو صحة البيانات.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      types: (product.types || []).join(', '),
      size: product.size || '',
      price: product.price || '',
      description: product.description || ''
    });
    setFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container dark-theme">
        <div className="admin-card auth-card">
          <div className="admin-header">
            <img src="/logo.jpg" alt="VERO Logo" className="admin-logo" />
            <h2>تسجيل الدخول</h2>
            <p>يرجى إدخال كلمة المرور للوصول للوحة التحكم</p>
          </div>
          {message.text && (
            <div className={`admin-message ${message.type}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleLogin} className="admin-form">
            <div className="form-group">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="كلمة المرور"
              />
            </div>
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? 'جاري التحقق...' : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container dark-theme">
      <div className="admin-header">
        <img src="/logo.jpg" alt="VERO Logo" className="admin-logo" />
        <h2>{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
        <p>{editingId ? 'قم بتعديل بيانات المنتج أدناه' : 'أدخل بيانات المنتج الجديد'}</p>
      </div>

      <div className="admin-card">
        {message.text && (
          <div className={`admin-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>اسم المنتج</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: VERO NOIR" />
          </div>

          <div className="form-group">
            <label>الأنواع المتاحة (افصل بينها بفاصلة)</label>
            <input type="text" name="types" value={formData.types} onChange={handleChange} required placeholder="مثال: Eau de Parfum, Extrait de Parfum" />
          </div>

          <div className="form-group">
            <label>الحجم</label>
            <input type="text" name="size" value={formData.size} onChange={handleChange} required placeholder="مثال: 100ml" />
          </div>

          <div className="form-group">
            <label>السعر (جنية مصري)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" placeholder="مثال: 1500" />
          </div>

          <div className="form-group">
            <label>صور المنتج (يمكنك اختيار أكثر من صورة)</label>
            <input type="file" id="file-upload" multiple accept="image/*" onChange={handleFileChange} required />
          </div>

          <div className="form-group">
            <label>تفاصيل ووصف العطر</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" placeholder="اكتب تفاصيل ومكونات العطر هنا..."></textarea>
          </div>

          <div className="admin-form-actions" style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? 'جاري الحفظ...' : (editingId ? 'تعديل المنتج' : 'إضافة المنتج')}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="admin-cancel-btn" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', types: '', size: '', price: '', description: '' });
                  setFiles([]);
                }}
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Products List */}
      <div className="admin-card mt-8">
        <h3 style={{ color: '#000', marginBottom: '20px', textAlign: 'center' }}>المنتجات الحالية ({productsList.length})</h3>
        
        {productsList.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>لا توجد منتجات مضافة بعد.</p>
        ) : (
          <div className="admin-product-list">
            {productsList.map(product => (
              <div key={product.id} className="admin-product-item">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : '/logo.jpg'} 
                  alt={product.name} 
                  className="admin-product-img"
                />
                <div className="admin-product-info">
                  <h4>{product.name}</h4>
                  <p>{product.price} جنية</p>
                </div>
                <div className="admin-product-actions">
                  <button onClick={() => handleEdit(product)} className="admin-edit-btn">تعديل</button>
                  <button onClick={() => handleDelete(product.id)} className="admin-delete-btn">حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
