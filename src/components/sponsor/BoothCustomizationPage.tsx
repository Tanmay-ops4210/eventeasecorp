import React from 'react';
import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Save, Upload, Trash2, Eye, Download, Image, Video, 
  Palette, Type, Layout, Settings, Loader2, Plus,
  X, Check, AlertCircle, FileText
} from 'lucide-react';
import { BoothCustomization, BoothAsset } from '../../types/sponsorExhibitor';
import { sponsorExhibitorService } from '../../services/sponsorExhibitorService';

const BoothCustomizationPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [customization, setCustomization] = useState<BoothCustomization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState<'brochure' | 'video' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    setBreadcrumbs(['Virtual Booth Customization']);
    loadBoothCustomization();
  }, [setBreadcrumbs]);

  const loadBoothCustomization = async () => {
    try {
      setIsLoading(true);
      const data = await sponsorExhibitorService.getBoothCustomization();
      setCustomization(data);
    } catch (error) {
      console.error('Failed to load booth customization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (!customization) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCustomization(prev => prev ? {
        ...prev,
        [parent]: {
          ...prev[parent as keyof BoothCustomization],
          [child]: value
        }
      } : null);
    } else {
      setCustomization(prev => prev ? { ...prev, [field]: value } : null);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'brochure' | 'video') => {
    const file = e.target.files?.[0];
    if (!file || !customization) return;

    setUploadingAsset(type);
    try {
      const result = await sponsorExhibitorService.uploadAsset(file, type);
      if (result.success && result.asset) {
        const assetArray = type === 'brochure' ? 'brochures' : 'videos';
        setCustomization(prev => prev ? {
          ...prev,
          [assetArray]: [...prev[assetArray], result.asset!]
        } : null);
      } else {
        alert(result.error || 'Failed to upload file');
      }
    } catch (error) {
      alert('Failed to upload file');
    } finally {
      setUploadingAsset(null);
    }
  };

  const handleDeleteAsset = async (assetId: string, type: 'brochure' | 'video') => {
    if (!customization) return;
    
    try {
      const result = await sponsorExhibitorService.deleteAsset(assetId);
      if (result.success) {
        const assetArray = type === 'brochure' ? 'brochures' : 'videos';
        setCustomization(prev => prev ? {
          ...prev,
          [assetArray]: prev[assetArray].filter(asset => asset.id !== assetId)
        } : null);
      } else {
        alert(result.error || 'Failed to delete asset');
      }
    } catch (error) {
      alert('Failed to delete asset');
    }
  };

  const validateForm = (): boolean => {
    if (!customization) return false;
    
    const newErrors: Record<string, string> = {};
    
    if (!customization.primaryColor) newErrors.primaryColor = 'Primary color is required';
    if (!customization.description.trim()) newErrors.description = 'Description is required';
    if (!customization.contactInfo.email.trim()) newErrors['contactInfo.email'] = 'Email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!customization || !validateForm()) return;
    
    setSaving(true);
    try {
      const result = await sponsorExhibitorService.updateBoothCustomization(customization);
      if (result.success) {
        alert('Booth customization saved successfully!');
      } else {
        alert(result.error || 'Failed to save customization');
      }
    } catch (error) {
      alert('Failed to save customization');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading booth customization...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!customization) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load</h2>
          <button
            onClick={loadBoothCustomization}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Virtual Booth Customization</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customization Form */}
          <div className="space-y-6">
            {/* Branding */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Branding & Colors</span>
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={customization.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.primaryColor ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="#3b82f6"
                      />
                    </div>
                    {errors.primaryColor && <p className="text-red-500 text-sm mt-1">{errors.primaryColor}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={customization.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.secondaryColor}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="#6366f1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={customization.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner URL</label>
                  <input
                    type="url"
                    value={customization.banner}
                    onChange={(e) => handleInputChange('banner', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Type className="w-5 h-5" />
                <span>Content & Description</span>
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booth Description</label>
                <textarea
                  value={customization.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your company and what visitors can expect at your booth..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Contact Information</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={customization.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors['contactInfo.email'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="contact@company.com"
                  />
                  {errors['contactInfo.email'] && <p className="text-red-500 text-sm mt-1">{errors['contactInfo.email']}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={customization.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={customization.contactInfo.website}
                    onChange={(e) => handleInputChange('contactInfo.website', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://company.com"
                  />
                </div>
              </div>
            </div>

            {/* Assets */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Marketing Assets</span>
              </h2>
              
              {/* Brochures */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Brochures & Documents</h3>
                  <label className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors duration-200">
                    {uploadingAsset === 'brochure' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploadingAsset === 'brochure' ? 'Uploading...' : 'Upload PDF'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'brochure')}
                      className="hidden"
                      disabled={uploadingAsset !== null}
                    />
                  </label>
                </div>
                
                <div className="space-y-3">
                  {customization.brochures.map((brochure, index) => (
                    <div key={brochure.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900">{brochure.name}</p>
                          <p className="text-sm text-gray-500">{(brochure.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={brochure.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteAsset(brochure.id, 'brochure')}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {customization.brochures.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No brochures uploaded yet</p>
                  )}
                </div>
              </div>

              {/* Videos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Videos</h3>
                  <label className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors duration-200">
                    {uploadingAsset === 'video' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploadingAsset === 'video' ? 'Uploading...' : 'Upload Video'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="hidden"
                      disabled={uploadingAsset !== null}
                    />
                  </label>
                </div>
                
                <div className="space-y-3">
                  {customization.videos.map((video, index) => (
                    <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Video className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-gray-900">{video.name}</p>
                          <p className="text-sm text-gray-500">{(video.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteAsset(video.id, 'video')}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {customization.videos.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No videos uploaded yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Layout className="w-5 h-5" />
                <span>Booth Preview</span>
              </h2>
              
              {showPreview && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Booth Header */}
                  <div 
                    className="h-32 bg-gradient-to-r p-6 text-white relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})` 
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={customization.logo}
                        alt="Company Logo"
                        className="w-16 h-16 bg-white rounded-lg p-2 object-contain"
                      />
                      <div>
                        <h3 className="text-xl font-bold">TechCorp Industries</h3>
                        <p className="text-white/90">Innovation Hub</p>
                      </div>
                    </div>
                  </div>

                  {/* Booth Content */}
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">{customization.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
                        <div className="space-y-2">
                          {customization.brochures.slice(0, 2).map((brochure) => (
                            <div key={brochure.id} className="flex items-center space-x-2 text-sm">
                              <FileText className="w-4 h-4 text-red-500" />
                              <span className="text-gray-700">{brochure.name}</span>
                            </div>
                          ))}
                          {customization.brochures.length === 0 && (
                            <p className="text-gray-500 text-sm">No resources yet</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Videos</h4>
                        <div className="space-y-2">
                          {customization.videos.slice(0, 2).map((video) => (
                            <div key={video.id} className="flex items-center space-x-2 text-sm">
                              <Video className="w-4 h-4 text-purple-500" />
                              <span className="text-gray-700">{video.name}</span>
                            </div>
                          ))}
                          {customization.videos.length === 0 && (
                            <p className="text-gray-500 text-sm">No videos yet</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📧 {customization.contactInfo.email}</p>
                        <p>📞 {customization.contactInfo.phone}</p>
                        <p>🌐 {customization.contactInfo.website}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!showPreview && (
                <div className="text-center py-12 border border-gray-200 rounded-lg">
                  <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click "Show Preview" to see your booth</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothCustomizationPage;