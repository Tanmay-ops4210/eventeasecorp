import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Edit, Save, Plus, Trash2, FileText, Image, Video, AlertTriangle } from 'lucide-react';

interface ContentBlock {
  id: string;
  page: string;
  section: string;
  content: string;
  type: 'text' | 'image' | 'video';
}

const mockContent: ContentBlock[] = [
  { id: '1', page: 'Home', section: 'Hero Title', content: 'Event Websites', type: 'text' },
  { id: '2', page: 'Home', section: 'Hero Subtitle', content: 'A unique event filled with networking, workshops, seminars, and engaging conversations with the industry\'s leading experts.', type: 'text' },
  { id: '3', page: 'About', section: 'Main Heading', content: 'ABOUT EVENTEASE', type: 'text' },
  { id: '4', page: 'Contact', section: 'Header', content: 'CONTACT', type: 'text' },
];

const ContentManagementPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [content, setContent] = useState<ContentBlock[]>(mockContent);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  React.useEffect(() => {
    setBreadcrumbs(['Global Content Management']);
  }, [setBreadcrumbs]);

  const handleEdit = (block: ContentBlock) => {
    setEditingId(block.id);
    setEditedContent(block.content);
  };

  const handleSave = (id: string) => {
    setContent(content.map(c => c.id === id ? { ...c, content: editedContent } : c));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const getIcon = (type: 'text' | 'image' | 'video') => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-gray-500" />;
      case 'video': return <Video className="w-5 h-5 text-gray-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Global Content Management</h1>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Plus className="w-4 h-4" />
                <span>Add Content Block</span>
            </button>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-8">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                        Changes made here will affect the live website content. Please be certain before saving.
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {content.map((block) => (
                            <tr key={block.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{block.page}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{block.section}</td>
                                <td className="px-6 py-4">
                                    {editingId === block.id ? (
                                        <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full p-2 border rounded-lg" rows={3}/>
                                    ) : (
                                        <div className="flex items-start space-x-2">
                                            {getIcon(block.type)}
                                            <p className="text-gray-700 truncate max-w-sm">{block.content}</p>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {editingId === block.id ? (
                                        <>
                                            <button onClick={() => handleSave(block.id)} className="text-green-600 hover:text-green-900"><Save className="w-4 h-4"/></button>
                                            <button onClick={handleCancel} className="text-gray-600 hover:text-gray-900">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(block)} className="text-indigo-600 hover:text-indigo-900"><Edit className="w-4 h-4"/></button>
                                            <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4"/></button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagementPage;
