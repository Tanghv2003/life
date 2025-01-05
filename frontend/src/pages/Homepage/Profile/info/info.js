import React, { useState, useEffect } from 'react';
import editIcon from '../../../../assets/edit.png';
import docIcon from '../../../../assets/doc.png';
import './info.css';
import { userService } from '../../../../services/user/user';
import { healthService } from '../../../../services/medical';
import { 
  getGoodPhysicalHealthDaysInLast30Days, 
  getGoodMentalHealthDaysInLast30Days 
} from '../../../../services/daily';

const formatDateOfBirth = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const validateUserData = (data) => {
  if (!data.name) return 'Name is required';
  if (!data.dateOfBirth) return 'Date of birth is required';
  if (data.height <= 0) return 'Height must be greater than 0';
  if (data.weight <= 0) return 'Weight must be greater than 0';
  return null;
};

const Info = () => {
  const userId = '67671fc9f438338fceba7540';
  const healthRecordId = '67797cc2a12f2a39e76cfa5e';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState({
    name: '',
    avatar: 'https://example.com/avatar.png',
    dateOfBirth: '',
    height: 0,
    weight: 0,
    gender: '',
  });

  // Tách riêng state cho dữ liệu sức khỏe hàng ngày
  const [dailyHealthData, setDailyHealthData] = useState({
    physicalHealth: 0,
    mentalHealth: 0,
  });

  const [healthData, setHealthData] = useState({
    bmi: 0,
    sleepTime: 7,
    genHealth: 'Good',
    physicalActivity: false,
    diffWalking: false,
    smoking: false,
    alcoholDrinking: false,
    race: 'Asian',
    stroke: false,
    diabetic: false,
    asthma: false,
    kidneyDisease: false,
    skinCancer: false,
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [editValues, setEditValues] = useState({ ...user });
  const [editHealthValues, setEditHealthValues] = useState({ ...healthData });

  // Hàm riêng để cập nhật dữ liệu sức khỏe hàng ngày
  const updateDailyHealthData = async () => {
    try {
      const [physicalHealthDays, mentalHealthDays] = await Promise.all([
        getGoodPhysicalHealthDaysInLast30Days(),
        getGoodMentalHealthDaysInLast30Days()
      ]);

      setDailyHealthData({
        physicalHealth: physicalHealthDays,
        mentalHealth: mentalHealthDays,
      });
    } catch (err) {
      console.error('Error fetching daily health data:', err);
      setError('Failed to fetch daily health data');
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [userData, bmiData, healthRecord] = await Promise.all([
          userService.getUser(userId),
          userService.getUserBMI(userId),
          healthService.getHealthRecordById(healthRecordId)
        ]);

        setUser(userData);
        setEditValues(userData);

        // Cập nhật healthData với dữ liệu từ API
        setHealthData(prevHealth => ({
          ...prevHealth,
          bmi: bmiData.bmi,
          ...healthRecord
        }));

        // Cập nhật dữ liệu sức khỏe hàng ngày
        await updateDailyHealthData();

      } catch (err) {
        setError('Failed to fetch user data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId, healthRecordId]);

  const handleEditClick = () => {
    setEditValues({ ...user });
    setIsEditOpen(true);
  };

  const handleHealthClick = () => {
    setEditHealthValues({ 
      ...healthData,
      physicalHealth: dailyHealthData.physicalHealth,
      mentalHealth: dailyHealthData.mentalHealth,
    });
    setIsHealthOpen(true);
  };

  // Các hàm xử lý không thay đổi
  const handleSave = async () => {
    const validationError = validateUserData(editValues);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      const updatedUser = await userService.updateUser(userId, editValues);
      setUser(updatedUser);

      const bmiData = await userService.getUserBMI(userId);
      setHealthData(prevHealth => ({
        ...prevHealth,
        bmi: bmiData.bmi
      }));

      setIsEditOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to update user information');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleHealthSave = async () => {
    try {
      setSaving(true);
      const updatedHealthRecord = await healthService.updateHealthRecord(healthRecordId, editHealthValues);
      setHealthData(updatedHealthRecord);
      
      // Cập nhật lại dữ liệu sức khỏe hàng ngày sau khi lưu
      await updateDailyHealthData();
      
      setIsHealthOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to update health information');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHealthInputChange = (field, value) => {
    setEditHealthValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-info">
      <div className="header1a">
        <h2>My Profile</h2>
        <div>
          <button className="edit-btn" onClick={handleEditClick}>
            <img src={editIcon} alt="Edit" />
          </button>
          <button className="edit-btn" onClick={handleHealthClick}>
            <img src={docIcon} alt="Health" />
          </button>
        </div>
      </div>

      <div className="user-info-content">
        <img src={user.avatar} alt="Avatar" className="avatar" />
        <div className="user-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Date of Birth:</strong> {formatDateOfBirth(user.dateOfBirth)}</p>
        </div>
      </div>

      <div className="user-stats">
        <p><strong>Height:</strong><span className="stat-value">{user.height} cm</span></p>
        <p><strong>Weight:</strong><span className="stat-value">{user.weight} kg</span></p>
        <p><strong>Sex:</strong><span className="stat-value">{user.gender}</span></p>
      </div>

      {isEditOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>UPDATE INFORMATION</h2>
            
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={editValues.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Date of Birth:</label>
              <input
                type="date"
                value={editValues.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Height (cm):</label>
              <input
                type="number"
                value={editValues.height}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
              />
            </div>
            
            <div className="form-group">
              <label>Weight (kg):</label>
              <input
                type="number"
                value={editValues.weight}
                onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
              />
            </div>
            
            <div className="form-group">
              <label>Sex:</label>
              <select
                value={editValues.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setIsEditOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {isHealthOpen && (
        <div className="modal-overlay">
          <div className="modal-content health-modal">
            <h2>HEALTH TRACKING</h2>

            {/* Chỉ số cơ bản */}
            <div className="health-section">
              <h3>Basic Metrics</h3>
              <div className="form-group">
                <label>BMI:</label>
                <input
                  type="text"
                  value={editHealthValues.bmi}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="form-group">
                <label>Sleep Time (hours/day):</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={editHealthValues.sleepTime}
                  onChange={(e) => handleHealthInputChange('sleepTime', parseFloat(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>General Health:</label>
                <select
                  value={editHealthValues.genHealth}
                  onChange={(e) => handleHealthInputChange('genHealth', e.target.value)}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>

            {/* Thông tin sức khỏe chi tiết - Readonly */}
            <div className="health-section">
              <h3>Health Status (This Month)</h3>
              <div className="form-group">
                <label>Physical Health (good days):</label>
                <input
                  type="text"
                  value={editHealthValues.physicalHealth}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="form-group">
                <label>Mental Health (good days):</label>
                <input
                  type="text"
                  value={editHealthValues.mentalHealth}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="form-group">
                <label>Physical Activity:</label>
                <select
                  value={editHealthValues.physicalActivity}
                  onChange={(e) => handleHealthInputChange('physicalActivity', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Difficulty Walking:</label>
                <select
                  value={editHealthValues.diffWalking}
                  onChange={(e) => handleHealthInputChange('diffWalking', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            {/* Thói quen */}
            <div className="health-section">
              <h3>Lifestyle Habits</h3>
              <div className="form-group">
                <label>Smoking Status:</label>
                <select
                  value={editHealthValues.smoking}
                  onChange={(e) => handleHealthInputChange('smoking', e.target.value)}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                  
                </select>
              </div>
              <div className="form-group">
                <label>Alcohol Drinking:</label>
                <select
                  value={editHealthValues.alcoholDrinking}
                  onChange={(e) => handleHealthInputChange('alcoholDrinking', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            {/* Thông tin chủng tộc */}
            <div className="health-section">
              <h3>Demographics</h3>
              <div className="form-group">
                <label>Race:</label>
                <select
                  value={editHealthValues.race}
                  onChange={(e) => handleHealthInputChange('race', e.target.value)}
                >
                  <option value="Asian">Asian</option>
                  <option value="Black">Black</option>
                  <option value="Hispanic">Hispanic</option>
                  <option value="White">White</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Bệnh lý */}
            <div className="health-section">
              <h3>Medical Conditions</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Stroke History:</label>
                  <select
                    value={editHealthValues.stroke}
                    onChange={(e) => handleHealthInputChange('stroke', e.target.value === 'true')}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Diabetic:</label>
                  <select
                    value={editHealthValues.diabetic}
                    onChange={(e) => handleHealthInputChange('diabetic', e.target.value === 'true')}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Asthma:</label>
                  <select
                    value={editHealthValues.asthma}
                    onChange={(e) => handleHealthInputChange('asthma', e.target.value === 'true')}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Kidney Disease:</label>
                  <select
                    value={editHealthValues.kidneyDisease}
                    onChange={(e) => handleHealthInputChange('kidneyDisease', e.target.value === 'true')}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Skin Cancer:</label>
                <select
                  value={editHealthValues.skinCancer}
                  onChange={(e) => handleHealthInputChange('skinCancer', e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setIsHealthOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleHealthSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Info;